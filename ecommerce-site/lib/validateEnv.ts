/**
 * Environment Variable Validator
 *
 * Validates that all required environment variables are set based on the
 * current configuration. This helps catch missing variables at build time
 * rather than at runtime.
 *
 * Usage: Call validateEnv() at the start of your application (e.g., in layout.tsx)
 */

interface ValidationError {
  variable: string;
  reason: string;
}

export function validateEnv(): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  // Always required variables
  const alwaysRequired = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_ADMIN_PIN",
    "RESEND_API_KEY",
  ];

  for (const varName of alwaysRequired) {
    if (!process.env[varName]) {
      errors.push({
        variable: varName,
        reason: "Required for all environments",
      });
    }
  }

  // Validate Supabase URL is present (with fallback check)
  if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push({
      variable: "SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL",
      reason: "At least one Supabase URL variable must be set",
    });
  }

  // Payment provider validation
  const paymentsProvider = process.env.PAYMENTS_PROVIDER || "mock";

  if (paymentsProvider === "razorpay") {
    const razorpayVars = [
      "RAZORPAY_KEY_ID",
      "RAZORPAY_KEY_SECRET",
      "NEXT_PUBLIC_RAZORPAY_KEY_ID",
    ];

    for (const varName of razorpayVars) {
      const value = process.env[varName];
      if (!value || value === "placeholder") {
        errors.push({
          variable: varName,
          reason: `Required when PAYMENTS_PROVIDER=razorpay (current: ${paymentsProvider})`,
        });
      }
    }
  }

  // Shipping provider validation (optional but warn if configured)
  const shipProvider = process.env.SHIP_PROVIDER;
  if (shipProvider === "shiprocket") {
    const shiprocketVars = [
      "SHIPROCKET_EMAIL",
      "SHIPROCKET_PASSWORD",
      "SHIPROCKET_PICKUP_LOCATION",
    ];

    for (const varName of shiprocketVars) {
      if (!process.env[varName]) {
        errors.push({
          variable: varName,
          reason: `Required when SHIP_PROVIDER=shiprocket (current: ${shipProvider})`,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Throws an error if environment validation fails
 * Use this for server-side validation at startup
 */
export function validateEnvOrThrow(): void {
  const result = validateEnv();

  if (!result.valid) {
    const errorMessage = [
      "❌ Environment validation failed:",
      "",
      ...result.errors.map(
        (err) => `  • ${err.variable}: ${err.reason}`
      ),
      "",
      "Please check your .env.local file and ensure all required variables are set.",
    ].join("\n");

    throw new Error(errorMessage);
  }
}

/**
 * Returns a summary of the current environment configuration
 * Useful for debugging and logging
 */
export function getEnvSummary(): {
  paymentsProvider: string;
  paymentsMode: "mock" | "live";
  shipProvider: string;
  shipMode: "mock" | "live";
} {
  const paymentsProvider = process.env.PAYMENTS_PROVIDER || "mock";
  const shipProvider = process.env.SHIP_PROVIDER || "mock";

  return {
    paymentsProvider,
    paymentsMode: paymentsProvider === "mock" ? "mock" : "live",
    shipProvider,
    shipMode: shipProvider === "mock" ? "mock" : "live",
  };
}

// Auto-validate in development (with warnings only)
if (process.env.NODE_ENV === "development") {
  const result = validateEnv();
  if (!result.valid) {
    console.warn("⚠️  Environment validation warnings:");
    result.errors.forEach((err) => {
      console.warn(`  • ${err.variable}: ${err.reason}`);
    });
    console.warn("");
  }

  // Log current configuration
  const summary = getEnvSummary();
  console.log("🔧 Environment Configuration:");
  console.log(`  • Payments: ${summary.paymentsProvider} (${summary.paymentsMode})`);
  console.log(`  • Shipping: ${summary.shipProvider} (${summary.shipMode})`);
  console.log("");
}

// Endpoint para probar manualmente el health check
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Simular una llamada al health check
        const baseUrl = req.headers.host;
        const protocol = req.headers["x-forwarded-proto"] || "http";
        const healthCheckUrl = `${protocol}://${baseUrl}/api/health-check`;

        console.log(`🧪 Testing health check endpoint: ${healthCheckUrl}`);

        const response = await fetch(healthCheckUrl, {
            method: "GET",
            headers: {
                "User-Agent": "Manual-Test/1.0",
            },
        });

        const data = await response.json();

        return res.status(200).json({
            message: "Health check test completed",
            healthCheckResponse: data,
            testTimestamp: new Date().toISOString(),
            note: "This endpoint is for manual testing. The actual cron runs automatically every 10 minutes.",
        });
    } catch (error) {
        return res.status(500).json({
            error: "Failed to test health check",
            message: error.message,
            testTimestamp: new Date().toISOString(),
        });
    }
}

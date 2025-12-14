export default async function handler(req, res) {
    // Solo permitir métodos GET y POST para el cron
    if (req.method !== "GET" && req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // URL del endpoint de health check de tu API
        // Cambia esta URL por la de tu API real
        const healthEndpoint =
            process.env.HEALTH_CHECK_URL || "https://jsonplaceholder.typicode.com/posts/1";

        console.log(`🔍 Checking health of: ${healthEndpoint}`);

        const response = await fetch(healthEndpoint, {
            method: "GET",
            headers: {
                "User-Agent": "Vercel-Health-Check/1.0",
                Accept: "application/json",
            },
            // Timeout de 8 segundos (menor al límite de Vercel)
            signal: AbortSignal.timeout(8000),
        });

        const responseTime = Date.now();

        if (response.ok) {
            console.log(`✅ Health check passed - Status: ${response.status}`);

            return res.status(200).json({
                status: "success",
                endpoint: healthEndpoint,
                httpStatus: response.status,
                timestamp: new Date().toISOString(),
                responseTime: `${Date.now() - responseTime}ms`,
                message: "API is healthy",
            });
        } else {
            console.log(`❌ Health check failed - Status: ${response.status}`);

            return res.status(200).json({
                status: "warning",
                endpoint: healthEndpoint,
                httpStatus: response.status,
                timestamp: new Date().toISOString(),
                message: `API returned ${response.status}`,
            });
        }
    } catch (error) {
        console.log(`🚨 Health check error: ${error.message}`);

        // Determinar el tipo de error
        let errorType = "unknown";
        if (error.name === "AbortError") {
            errorType = "timeout";
        } else if (error.message.includes("fetch")) {
            errorType = "network";
        }

        return res.status(200).json({
            status: "error",
            endpoint: process.env.HEALTH_CHECK_URL || "not-configured",
            timestamp: new Date().toISOString(),
            error: {
                type: errorType,
                message: error.message,
            },
        });
    }
}

#!/usr/bin/env node

/**
 * Health Check Script for GitHub Actions
 * Alternativa más avanzada al curl básico
 */

const https = require("https");
const http = require("http");
const { URL } = require("url");

// Configuración
const config = {
    url: process.env.HEALTH_CHECK_URL,
    timeout: parseInt(process.env.TIMEOUT) || 30000,
    retries: parseInt(process.env.RETRIES) || 2,
    retryDelay: parseInt(process.env.RETRY_DELAY) || 5000,
    userAgent: "GitHub-Actions-Health-Check-Script/1.0",
};

// Verificar que la URL esté configurada
if (!config.url) {
    console.error("❌ ERROR: HEALTH_CHECK_URL environment variable not set");
    console.error("Please configure the HEALTH_CHECK_URL environment variable");
    process.exit(1);
}

console.log("🔍 Starting Health Check...");
console.log(`📍 URL: ${config.url}`);
console.log(`⏱️  Timeout: ${config.timeout}ms`);
console.log(`🔄 Retries: ${config.retries}`);
console.log("");

/**
 * Hace una petición HTTP con timeout y retry
 */
function makeRequest(url, attempt = 1) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === "https:";
        const client = isHttps ? https : http;

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: "GET",
            headers: {
                "User-Agent": config.userAgent,
                Accept: "application/json",
                "Cache-Control": "no-cache",
            },
            timeout: config.timeout,
        };

        console.log(`📡 Attempt ${attempt}/${config.retries + 1}...`);

        const startTime = Date.now();

        const req = client.request(options, (res) => {
            const responseTime = Date.now() - startTime;
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data,
                    responseTime,
                    attempt,
                });
            });
        });

        req.on("timeout", () => {
            req.destroy();
            reject(new Error(`Request timeout after ${config.timeout}ms`));
        });

        req.on("error", (error) => {
            reject(error);
        });

        req.end();
    });
}

/**
 * Sleep function para delays
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Función principal con retry logic
 */
async function healthCheck() {
    let lastError;

    for (let attempt = 1; attempt <= config.retries + 1; attempt++) {
        try {
            const result = await makeRequest(config.url, attempt);

            // Success
            console.log(`✅ SUCCESS (Attempt ${attempt})`);
            console.log(`📊 Status: ${result.statusCode}`);
            console.log(`⚡ Response Time: ${result.responseTime}ms`);
            console.log(`📦 Content Length: ${result.body.length} bytes`);

            // Intentar parsear JSON si es posible
            try {
                const jsonBody = JSON.parse(result.body);
                console.log("📄 Response Body:");
                console.log(JSON.stringify(jsonBody, null, 2));
            } catch {
                console.log("📄 Response Body (raw):");
                console.log(
                    result.body.substring(0, 200) + (result.body.length > 200 ? "..." : "")
                );
            }

            // Evaluar status code
            if (result.statusCode >= 200 && result.statusCode < 300) {
                console.log("🎉 Health check PASSED!");
                process.exit(0);
            } else if (result.statusCode >= 400) {
                console.log(`⚠️  Health check returned HTTP ${result.statusCode}`);
                process.exit(1);
            }

            return result;
        } catch (error) {
            lastError = error;
            console.log(`❌ Attempt ${attempt} failed: ${error.message}`);

            // Si no es el último intento, esperar antes del retry
            if (attempt < config.retries + 1) {
                console.log(`⏳ Waiting ${config.retryDelay}ms before retry...`);
                await sleep(config.retryDelay);
            }
        }
    }

    // Si llegamos aquí, todos los intentos fallaron
    console.log("🚨 All attempts failed!");
    console.log(`💥 Final error: ${lastError.message}`);
    process.exit(1);
}

// Ejecutar health check
healthCheck().catch((error) => {
    console.error("💥 Unexpected error:", error);
    process.exit(1);
});

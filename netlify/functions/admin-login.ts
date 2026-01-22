import { Handler } from '@netlify/functions'

const handler: Handler = async (event) => {
  // Recebe a senha enviada pelo front-end
  const { password } = JSON.parse(event.body || '{}')
  // Recupera a senha do ambiente (NUNCA use VITE_ no back-end)
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Senha de admin não configurada no ambiente.' })
    }
  }

  if (password === adminPassword) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    }
  }

  return {
    statusCode: 401,
    body: JSON.stringify({ success: false, error: 'Senha incorreta.' })
  }
}

export { handler }

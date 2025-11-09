const nodemailer = require('nodemailer')

// @desc    Enviar mensaje de contacto
// @route   POST /api/contact/send
// @access  Public
exports.sendContactMessage = async (req, res) => {
  try {
    const { nombre, email, telefono, asunto, mensaje } = req.body

    if (!nombre || !email || !asunto || !mensaje) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben estar completos' })
    }

    // Configurar transporter de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const mensajeCompleto = `
Nuevo mensaje de contacto desde Áurea Virtual Shop

Nombre: ${nombre}
Email: ${email}
Teléfono: ${telefono || 'No proporcionado'}
Asunto: ${asunto}

Mensaje:
${mensaje}
    `

    // Enviar email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Nuevo mensaje de contacto: ${asunto}`,
      text: mensajeCompleto,
      replyTo: email
    })

    res.json({ message: 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.' })
  } catch (error) {
    console.error('Error al enviar email:', error)
    res.status(500).json({ message: 'Error al enviar el mensaje', error: error.message })
  }
}

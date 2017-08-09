module.exports = {
	Mail:{
		transports:{
      user:process.env.SENDGRID_USERNAME,
      pass:process.env.SENDGRID_PASSWORD
    }
	}
}
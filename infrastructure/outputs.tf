output "instance_public_ip" {
  value = aws_instance.web.public_ip
}

output "private_key_pem" {
  value     = tls_private_key.deployer.private_key_pem
  sensitive = true
}

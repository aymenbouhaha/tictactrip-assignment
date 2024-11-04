provider "aws" {
  region = var.aws_region
}


resource "tls_private_key" "deployer" {
  algorithm = "RSA"
  rsa_bits  = 2048
}


resource "aws_key_pair" "deployer" {
  key_name   = var.ssh_key_name
  public_key = tls_private_key.deployer.public_key_openssh
}

resource "aws_security_group" "web_sg" {
  name        = "server_sg"
  description = "Allow HTTP traffic on port 80 and SSH"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
}

resource "aws_instance" "web" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  key_name                    = aws_key_pair.deployer.key_name
  vpc_security_group_ids      = [aws_security_group.web_sg.id]
  associate_public_ip_address = true

  tags = {
      Name = "aymen-back"
  }


  provisioner "file" {
    source      = "${path.module}/nginx_default.conf"
    destination = "/home/ubuntu/nginx_default.conf"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      host        = self.public_ip
      private_key = tls_private_key.deployer.private_key_pem
    }
  }


  provisioner "remote-exec" {
    inline = [

      "sudo apt-get update -y",


      "sudo apt-get install -y docker.io",
      "sudo systemctl start docker",
      "sudo systemctl enable docker",
      "sudo usermod -aG docker ubuntu",


      "sudo apt-get install -y nginx",
      "sudo systemctl start nginx",
      "sudo systemctl enable nginx",


      "sudo mv /home/ubuntu/nginx_default.conf /etc/nginx/sites-available/default",
      "sudo ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default",
      "sudo systemctl restart nginx",


      "sudo curl -L \"https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose",
      "sudo chmod +x /usr/local/bin/docker-compose",
      "docker-compose --version"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      host        = self.public_ip
      private_key = tls_private_key.deployer.private_key_pem
    }
  }
}


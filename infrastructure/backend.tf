terraform {
  backend "s3" {
    bucket = "aymen-terraform-state"
    key    = "deployment/state"
    region = "eu-west-3"
  }
}

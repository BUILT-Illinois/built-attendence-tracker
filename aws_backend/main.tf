module "lambda" {
    source = "./modules/lambda"
    lambda_role_arn = aws_iam_role.lambda_role.arn
}
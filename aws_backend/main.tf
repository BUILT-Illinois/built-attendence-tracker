module "lambda" {
    source = "./modules/lambda"
    lambda_role_arn = aws_iam_role.lambda_role.arn
    mongo_uri = var.mongo_uri
}

module "apigw" {
    source = "./modules/apigw"
    api_name = "attendance-tracker-api"
    lambda_invoke_arn = module.lambda.api_lambda_invoke_arn
    lambda_function_name = module.lambda.api_lambda_name
}
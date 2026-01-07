data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../../src"
  output_path = "${path.module}/../../src/lambda_api.zip"
}

resource "aws_lambda_function" "api_lambda" {
  function_name = "attendance-api-routing"
  role          = var.lambda_role_arn
  handler       = "handler.lambda_handler"
  runtime       = "python3.12"

  filename         = "${path.module}/../../src/lambda_api.zip"
  source_code_hash = data.archive_file.lambda.output_base64sha256

  timeout     = 10
  memory_size = 128
  
}
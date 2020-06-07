import json

def lambda_handler(event, context):
    word='test'
    try:
        if event:
            if 'body' in event and event['body']:
                body = json.loads(event['body'])
                if 'word' in body:
                    word = body['word']
    except Exception as e:
        return {
            'statusCode': 400,
            'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps(str(e))
        }
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            'Access-Control-Allow-Credentials': True
        },
        'body': json.dumps('Hello from Lambda! Your word is ' + word)
    }
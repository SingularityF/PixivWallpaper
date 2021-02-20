import os
import json
from error_handlers import exception_handler
from google.api_core import retry
from google.cloud import pubsub_v1


if __name__ == "__main__":
    try:
        project_id = os.environ['GCP_PROJ']
        subscription_id = os.environ['SUB_ID']
        subscriber = pubsub_v1.SubscriberClient.from_service_account_json(
            'service_account.json')
        subscription_path = subscriber.subscription_path(
            project_id, subscription_id)
        print("Connected to Pub/Sub")
    except:
        exception_handler("Connection to Pub/Sub failed")

    try:
        list_messages = []
        with subscriber:
            while True:
                response = subscriber.pull(
                    request={"subscription": subscription_path,
                             "max_messages": 1},
                    retry=retry.Retry(deadline=300),
                )
                if len(response.received_messages) == 1:
                    received_message = response.received_messages[0]
                    list_messages.append(
                        dict((key, received_message.message.attributes[key]) for key in received_message.message.attributes))
                    print(f"Received: {received_message.message.attributes}.")
                    subscriber.acknowledge(request={"subscription": subscription_path,
                                                    "ack_ids": [received_message.ack_id]})
                else:
                    break
        print("Messages pulled from Pub/Sub")
    except:
        exception_handler("Message pulling from Pub/Sub failed")

    try:
        with open('data.json', 'w') as f:
            json.dump(list_messages, f)
        print("Saved output to JSON")
    except:
        exception_handler("Output to JSON failed")

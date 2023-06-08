import weaviate

auth = (
    weaviate.auth.AuthApiKey(api_key="KNaObeDhRVRaI488QkEoprZ3LriotjRIo6Rg")
)

client = weaviate.Client("https://zgjbgueysdoxesgb7f8esa.gcp-d.weaviate.cloud", auth)


def _default_schema(index_name: str, text_key: str):
    return {
        "class": index_name,
        "properties": [
            {
                "name": text_key,
                "dataType": ["text"],
            }
        ],
    }


schema = _default_schema("testytest", "testytest")
client.schema.create_class(schema)

schema = client.schema.get()
print(schema)

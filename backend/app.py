from flask import Flask, request, jsonify
from flask_cors import CORS
import yaml
from opensearchpy import OpenSearch

with open('config.yml', 'r') as config:
    CONFIG = yaml.load(config.read(), Loader=yaml.FullLoader)

index_name = 'cards'
auth = (CONFIG['opensearch']['user'], CONFIG['opensearch']['pwd'])
client = OpenSearch(
    hosts=[{'host': CONFIG['opensearch']['host'], 'port': CONFIG['opensearch']['port']}],
    http_auth=auth,
    use_ssl=False,
    verify_certs=False
)
actual_cards_query = {"_source": [], "query": {"match_all": {}}}
test_response = client.search(index=index_name, body=actual_cards_query, size=10000)
cards_id = [hit['_source'] for hit in test_response['hits']['hits']]


app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return jsonify(cards_id)

@app.route("/card/<id>")
def get_card(id):
    # Construye la consulta para buscar una carta por ID
    search_body = {
        "query": {
            "term": {
                "id": id
            }
        }
    }

    response = client.search(index=index_name, body=search_body)
    hits = response['hits']['hits']

    if hits:
        # Retorna la primera coincidencia, si existe
        card = hits[0]['_source']
        return jsonify(card)

    else:
        return jsonify({"message": "Card not found"}), 404
@app.route("/cards")
def get_cards():
    page = int(request.args.get('page', 1))
    size = int(request.args.get('size', 20))
    start = (page - 1) * size
    query = request.args.get('query', '').lower()
    colors = request.args.get('colors', '').split(',')
    keywords = request.args.get('keywords', '').split(',')
    types = request.args.get('types', '').split(',')
    rarity = request.args.get('rarities', '').split(',')
    has_trigger = request.args.get('hasTrigger', '')
    attributes = request.args.get('attributes', '').split(',')
    cost_life = request.args.get('cost_life', '')
    counter = request.args.get('counter', '')
    edition = request.args.get('edition', '')
    power = request.args.get('power', '')
    sort = request.args.get('sort', '').split(',')

    must_clauses = []
    if query:
        must_clauses.append({"wildcard": {"name": f"*{query}*"}})
    if attributes and attributes[0]:
        must_clauses.append({"terms": {"attribute": attributes}})
    if colors and colors[0]:
        must_clauses.append({"terms": {"color": colors}})
    if types and types[0]:
        must_clauses.append({"terms": {"type": types}})
    if rarity and rarity[0]:
        must_clauses.append({"terms": {"rarity": rarity}})
    if cost_life:
        must_clauses.append({"match": {"cost_life": cost_life}})
    if counter:
        must_clauses.append({"match": {"counter": counter}})
    if edition:
        must_clauses.append({"match": {"edition": edition}})
    if has_trigger and has_trigger == 'yes':
        must_clauses.append({"term": {"has_trigger": True}})
    if keywords and keywords[0]:
        for keyword in keywords:
            must_clauses.append({"term": {"keywords": keyword}})
    if power:
        must_clauses.append({"match": {"power": power}})

    if must_clauses:

        search_body = {
            "query": {
                "bool": {
                    "must": must_clauses
                 }
            },
            "from": start,
            "size": size,
            "sort": [
                {"id": {"order": "asc"}}
            ]
        }
        print(search_body)
    else:
        search_body = {
            "query": {
                "match_all": {}
            },
            "from": start,
            "size": size,
            "sort": [
                {"id": {"order": "asc"}}
            ]
        }

    if sort and sort[0]:
        search_body['sort'] = [{sort[0]+'.keyword': {"order": sort[1]}}]
        print(search_body)

    response = client.search(index=index_name, body=search_body)
    cards = [hit['_source'] for hit in response['hits']['hits']]
    return jsonify(cards)

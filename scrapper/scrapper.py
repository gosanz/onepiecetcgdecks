import os
import ast
import yaml
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import re
import requests
import pandas as pd
from opensearchpy import OpenSearch
import logging.config
from logging_config import LOGGING_CONFIG

logging.config.dictConfig(LOGGING_CONFIG)


class OnePieceTcgScrapper:
    def __init__(self):
        self.config = None
        self.driver = None
        self.wait = None
        self.data = None
        self.edition = None

    def get_config(self):
        logging.info('Getting config file...')
        with open('config.yml', 'r') as config:
            self.config = yaml.load(config.read(), Loader=yaml.FullLoader)
        logging.info('Config file successfully retrieved')

    def create_driver(self):
        logging.info('Creating edge driver for scrapping...')
        edge_options = Options()
        edge_options.add_argument("--headless")
        edge_options.add_argument("window-size=1920,1080")
        service = Service(self.config['driver_path'])
        self.driver = webdriver.Edge(service=service, options=edge_options)
        self.wait = WebDriverWait(self.driver, 3)
        logging.info('Edge driver created, options: %s', edge_options.arguments)

    def download_image(self, card_image, card_id):
        if not os.path.exists('../Assets/' + self.edition):
            logging.info('Creating image directory for %s', self.edition)
            os.makedirs('../Assets/' + self.edition)
            logging.info('Directory created successfully for %s', self.edition)
        logging.info('Downloading image  for %s', card_id)
        image = requests.get(card_image).content
        with open('../Assets/' + self.edition + '/' + card_id + '.png', 'wb') as image_file:
            image_file.write(image)
        logging.info('Image downloaded successfully')

    def get_card_information(self):
        logging.info('Getting cards information...')
        logging.info('Getting page content: %s', self.config['url'])
        self.driver.get(self.config['url'])
        for edition in self.config['editions']:
            if os.path.exists('../Extracts/' + edition + '.csv'):
                logging.info('Edition %s will be skipped because it has been already extracted before. ', edition)
                continue
            logging.info('Getting cards from %s edition', edition)
            self.edition = edition
            select_element = self.wait.until(EC.presence_of_element_located((By.ID, 'series')))
            self.driver.execute_script("arguments[0].style.display = 'block';", select_element)
            select = Select(select_element)
            options = select.options
            for option in options:
                if edition in option.text:
                    select.select_by_value(option.get_attribute('value'))
                    submit_button = self.wait.until(EC.element_to_be_clickable(
                        (By.CSS_SELECTOR, 'div.commonBtn.submitBtn')))
                    submit_button.click()
                    break
            self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'a.modalOpen')))
            links = self.driver.find_elements(By.CSS_SELECTOR, 'a.modalOpen')
            ids = []
            for link in links:
                id = link.get_attribute('data-src').lstrip('#')
                ids.append(id)
            links[0].click()
            self.data = []
            for id in ids:
                page_content = self.driver.page_source
                soup = BeautifulSoup(page_content, 'html.parser')
                card_details = soup.find('dl', id=id)
                card_id = id
                card_rarity = (card_details.find('div', class_='infoCol')).text.split('|')[1].replace('"', '').strip()
                card_type = (card_details.find('div', class_='infoCol')).text.split('|')[2].replace('"', '').strip()
                card_name = (card_details.find('div', class_='cardName')).text
                card_cost_life = card_details.find('div', class_='cost').text
                card_life = int(card_cost_life.replace('Life', '').replace('"','').strip()) if 'Life' in card_cost_life else None
                card_cost = int(card_cost_life.replace('Cost', '').replace('"','').replace('-','0').strip()) if 'Cost' in card_cost_life else None
                card_attribute = card_details.find('div', class_='attribute').text.replace('Attribute', '').strip()
                card_attribute = [] if card_attribute == '-' else card_attribute.split('/')
                card_power = card_details.find('div', class_='power').text.replace('Power', '').replace('"', '').strip()
                card_power = None if card_power == '-' else card_power
                card_counter = card_details.find('div', class_='counter').text.replace('Counter', '').replace('"','').strip()
                card_counter = None if card_counter == '-' else card_counter
                card_color = card_details.find('div', class_='color').text.replace('Color', '').replace('"', '').strip().split('/')
                card_factions = card_details.find('div', class_='feature').text.replace('Type', '').replace('"', '').split('/')
                card_text = card_details.find('div', class_='text').text.replace('Effect', '').replace('"', '')
                card_text = '' if card_text == None or card_text == '-' else card_text
                card_keywords = re.findall(r'\[([^]]+)]', card_text) if card_text else []
                card_edition = card_details.find('div', class_='getInfo').text.replace('Card Set(s)', '').replace('"','').strip()
                card_has_trigger = True if card_details.find('div', class_='trigger') != None or 'counter' in card_keywords else False
                #card_image = card_details.find('img')['src'].replace('..', 'https://en.onepiece-cardgame.com')
                #self.download_image(card_image, card_id)
                card_data = {
                    'id': card_id,
                    'rarity': card_rarity,
                    'type': card_type,
                    'name': card_name,
                    'color': card_color,
                    'card_cost': card_cost,
                    'card_life': card_life,
                    'attribute': card_attribute,
                    'power': card_power,
                    'counter': card_counter,
                    'factions': card_factions,
                    'text': card_text,
                    'keywords': card_keywords,
                    'edition': card_edition,
                    'has_trigger': card_has_trigger
                }
                self.data.append(card_data)
                button = self.wait.until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.fancybox-button.fancybox-button--arrow_right')))
                button.click()
            actions = ActionChains(self.driver)
            actions.send_keys(Keys.ESCAPE).perform()
            logging.info('Data successfully extracted for %s edition', edition)
            self.generate_csv()

    def generate_csv(self):
        logging.info('Generating CSV file for %s edition', self.edition)
        df = pd.DataFrame(self.data)
        df.to_csv('../Extracts/' + self.edition + '.csv', index=False)
        logging.info('CSV file for %s edition generated successfully', self.edition)

    def index_data_opensearch(self):
        def convert_to_list(value):
            if isinstance(value, str):
                try:
                    return ast.literal_eval(value)
                except (ValueError, SyntaxError):
                    logging.warning(f"Failed to convert value to list: {value}")
                    return value
            return value
        logging.info('Initializing data indexation to opendata...')
        index_name = 'cards'
        auth = (self.config['opensearch']['user'], self.config['opensearch']['pwd'])
        client = OpenSearch(
            hosts=[{'host': self.config['opensearch']['host'], 'port': self.config['opensearch']['port']}],
            http_auth=auth,
            use_ssl=False,
            verify_certs=False
        )
        actual_cards_query = {"_source": ["id"], "query": {"match_all": {}}}
        logging.info('Getting cards index current data...')
        response = client.search(index=index_name, body=actual_cards_query, size=10000)
        logging.info('Current indexed items: % s', len(response['hits']['hits']))
        cards_id = [hit['_source']['id'] for hit in response['hits']['hits']]
        directory = '../Extracts/'
        
        logging.info('Creating dataframe from csv exports')
        dataframes = []
        for filename in os.listdir(directory):
            if filename.endswith(".csv"):
                file_path = os.path.join(directory, filename)
                df = pd.read_csv(file_path)
                dataframes.append(df)
        combined_df = pd.concat(dataframes, ignore_index=True)
        combined_df['factions'] = combined_df['factions'].apply(convert_to_list)
        combined_df['keywords'] = combined_df['keywords'].apply(convert_to_list)
        combined_df['color'] = combined_df['color'].apply(convert_to_list)
        combined_df['card_cost'] = combined_df['card_cost'].fillna(0).astype(int)
        combined_df['card_life'] = combined_df['card_life'].fillna(0).astype(int)
        combined_df['power'] = combined_df['power'].fillna(0).astype(int)
        combined_df['counter'] = combined_df['counter'].fillna(0).astype(int)
        combined_df['text'] = combined_df['text'].fillna('')
        combined_df['attribute'] = combined_df['attribute'].apply(convert_to_list)
        new_data = 0
        for i, row in combined_df.iterrows():
            if row['id'] in cards_id:
                continue
            logging.info('Inserting card %s into cards index', row['id'])
            document = row.to_dict()
            response = client.index(
                index=index_name,
                body=document,
                id=i
            )
            new_data += 1
            logging.info(response)
        if new_data == 0:
            logging.info('No new data to add to cards index')
        else:
            logging.info('New data indexed: %s ', str(new_data))


if __name__ == '__main__':
    scrapper = OnePieceTcgScrapper()
    scrapper.get_config()
    scrapper.create_driver()
    scrapper.get_card_information()
    scrapper.index_data_opensearch()

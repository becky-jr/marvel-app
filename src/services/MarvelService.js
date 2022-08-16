class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=7b729205e470cb19de6c35b2f87e1be5';
    _baseOffset = 200;

    getResource = async (url) =>{
        let res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async(offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacterById = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (character) => {
        function infoCheck() {
            if(character.description.length < 5 || character.description === 'undefined') {
                return character.description = "There is no description about this character";
            }
        }
        function strCheck() {
            if (character.description.length >= 200) {
                let slicedText =  character.description.slice(0, 200);
                return slicedText + '...';
            }
        }
        return {
            id: character.id,
            name: character.name,
            description: infoCheck() || strCheck(),
            thumbnail: character.thumbnail.path + '.' + character.thumbnail.extension,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            comics: character.comics.items
        }
    }
}

export default MarvelService;

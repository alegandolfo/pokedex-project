const openModal = (idModal) => {
    const divModal = document.querySelector(idModal)
    const modalContent = divModal.querySelector('.modal-content')
    divModal.style.display = "flex"
    divModal.style.animation = 'fading .2s'
    modalContent.style.animation = 'surge .2s'
}

const closeModal = (idModal) => {
    const divModal = document.querySelector(idModal)
    divModal.style.display = "none"
}

const handleModalClose = (event) => {
    if(event.target.className === "modal"){
        event.target.style.display = "none"
    }
}

const getFormattedPokemonName = (pName) => {
    let pokeName = pName.split('-')
    for (var i = 0; i < pokeName.length; i++) {
        pokeName[i] = pokeName[i].charAt(0).toUpperCase() + pokeName[i].slice(1);
    }
    pokeName = pokeName.join('-')

    return pokeName
}

const addPokemon = async (event) => {
    event.preventDefault()
    const newPokemonName = event.target.pokemon.value.toLowerCase()

    const pokemonWasFound = pokemonsList.find((pokemon) => {
        return pokemon.name === newPokemonName
    })
    
    if(pokemonWasFound){
        alert("This pokémon has already been added!")
        return
    }

    const loader = document.querySelector(".loader")
    closeModal('#add-pokemon')
    loader.style.display = "flex"

    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${newPokemonName}`)
        const data = await response.json()

        if(data.id){
            let pokeTypes = []
            for (var i = 0; i < data.types.length; i++) {pokeTypes[i] = data.types[i].type.name}

            const pokeSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`
            const pokeShiny = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${data.id}.png`

            const newPokemon = {name: newPokemonName, id: data.id, types: pokeTypes, nickname: '', 
                                hp: data.stats[0].base_stat, atk: data.stats[1].base_stat, def: data.stats[2].base_stat, 
                                spatk: data.stats[3].base_stat, spdef: data.stats[4].base_stat, speed: data.stats[5].base_stat, 
                                sprite: pokeSprite, shiny: pokeShiny}

            pokemonsList.push(newPokemon)
            renderPokemons()
        }else{
            alert(`Pokémon not found!`)
        }
    } catch (error){
        alert(error)
    }
    loader.style.display = "none"
}

const addBulkPokemon = async (event) => {
    event.preventDefault()
    const limit = event.target.limit.value
    const offset = event.target.offset.value - 1

    const bulkResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`)
    const bulkData = await bulkResponse.json()

    const loader = document.querySelector(".loader")
    closeModal('#add-bulk-pokemon')
    loader.style.display = "flex"

    for (var j = 0; j < bulkData.results.length; j++) {
        const newPokemonName = bulkData.results[j].name.toLowerCase()

        const pokemonWasFound = pokemonsList.find((pokemon) => {
            return pokemon.name === newPokemonName
        })
        
        if(pokemonWasFound){
            continue
        }

        try{
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${newPokemonName}`)
            const data = await response.json()

            if(data.id){
                let pokeTypes = []
                for (var i = 0; i < data.types.length; i++) {pokeTypes[i] = data.types[i].type.name}

                const pokeSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`
                const pokeShiny = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${data.id}.png`

                const newPokemon = {name: newPokemonName, id: data.id, types: pokeTypes, nickname: '', 
                                    hp: data.stats[0].base_stat, atk: data.stats[1].base_stat, def: data.stats[2].base_stat, 
                                    spatk: data.stats[3].base_stat, spdef: data.stats[4].base_stat, speed: data.stats[5].base_stat, 
                                    sprite: pokeSprite, shiny: pokeShiny}

                pokemonsList.push(newPokemon)
            }else{
                alert(`Pokémon not found!`)
            }
        } catch (error){
            alert(error)
        }
    }
    renderPokemons()
    loader.style.display = "none"
}

const editPokemon = async (event, pokemonName) => {
    event.preventDefault()
    const newPokemonNickname = event.target.pokemon.value
    if (newPokemonNickname.length > 20) {
        alert('This nickname is too big!')
        return
    }

    const newPokemonList = pokemonsList.map((pokemon) => {
        if(pokemon.name === pokemonName){
            return {name: pokemon.name, id: pokemon.id, types: pokemon.types, nickname: newPokemonNickname, 
                    hp: pokemon.hp, atk: pokemon.atk, def: pokemon.def, 
                    spatk: pokemon.spatk, spdef: pokemon.spdef, speed: pokemon.speed, 
                    sprite: pokemon.sprite, shiny: pokemon.shiny}
        } else {
            return pokemon
        }
    })

    pokemonsList = newPokemonList
    renderPokemons()
    closeModal('#edit-pokemon')
}

const removePokemon = (event) => {
    const btnClose = event.target
    const pokemon = btnClose.closest('.pokemon')
    const htmlPokemon = pokemon.querySelector('p')
    const pokemonId = parseInt(htmlPokemon.textContent.slice(1))
    const newPokemonList = pokemonsList.filter((pokemon) => {
        return pokemon.id !== pokemonId
    })
    pokemonsList = newPokemonList
    renderPokemons()
}

const handlePokemonMouseEnter = (event) => {
    const pokemon = event.target
    const btnClose = pokemon.querySelector(".btn-close")
    const btnEdit = pokemon.querySelector(".btn-edit")
    btnClose.style.display = "block"
    btnEdit.style.display = "block"
}

const handlePokemonMouseLeave = (event) => {
    const pokemon = event.target
    const btnClose = pokemon.querySelector(".btn-close")
    const btnEdit = pokemon.querySelector(".btn-edit")
    btnClose.style.display = "none"
    btnEdit.style.display = "none"
}

const addPokemonsEvents = () => {
    const pokemons = document.querySelectorAll(".pokemon")
    pokemons.forEach((pokemon) => {
        pokemon.addEventListener("mouseenter", handlePokemonMouseEnter)
        pokemon.addEventListener("mouseleave", handlePokemonMouseLeave)
    })
}

const renderPokemons = () => {
    pokemonsList.sort(function (x, y) {return x.id - y.id})

    const divPokemonsList = document.querySelector("#pokemons-list")
    divPokemonsList.innerHTML = ''
    pokemonsList.forEach((pokemon) => {
        let newPokemonTitle
        if (pokemon.nickname.length > 0) {
            newPokemonTitle = `<h2>${pokemon.nickname}</h2>
            <style>
            #pokemon-${pokemon.id} h2 {
                font-style: italic;
            }
            </style>`
        } else {
            newPokemonTitle = `<h2>${getFormattedPokemonName(pokemon.name)}</h2>`
        }

        let newPokemonImg
        if (pokemon.id < 906) {
            newPokemonImg = 
            `<img src="${pokemon.sprite}" alt="" class="regular-img">
             <img src="${pokemon.shiny}" alt="" class="hover-img" onclick="renderInfoModal('${pokemon.name}')">`
        } else {
            newPokemonImg = 
            `<img src="${pokemon.sprite}" alt="" class="regular-img">
             <img src="${pokemon.sprite}" alt="" class="hover-img" onclick="renderInfoModal('${pokemon.name}')">`
        }

        let newPokemonTypes
        if (pokemon.types.length > 1) {
            newPokemonTypes = 
            `<div id="types-list">
                <h4><span class="type ${pokemon.types[0]}"></span></h4>
                <h4><span class="type ${pokemon.types[1]}"></span></h4>
            </div>`
        } else {
            newPokemonTypes = 
            `<div id="types-list">
                <h4><span class="type ${pokemon.types[0]}"></span></h4>
            </div>`
        }
        
        const newPokemon = 
            `<div class="pokemon" id="pokemon-${pokemon.id}">
                <button class="btn-close" onclick="removePokemon(event)">x</button>
                <button class="btn-edit" onclick="renderEditModal('${pokemon.name}')">✎</button>
                <p>#${pokemon.id}</p>
                ${newPokemonTitle}
                ${newPokemonImg}
                ${newPokemonTypes}
            </div>`

        divPokemonsList.innerHTML += newPokemon
    })
    addPokemonsEvents()
}

const renderEditModal = (pName) => {
    const pokemon = pokemonsList.find(function (x) {return x.name == pName})

    const divPokemonModal = document.querySelector("#edit-pokemon")
    divPokemonModal.innerHTML = ''
    
    let pokemonModal = 
        `<div class="modal-content">
            <h1>Edit Pokémon</h1>
            <button class="btn-close" onclick="closeModal('#edit-pokemon')">x</button>
            <form onsubmit="editPokemon(event, '${pokemon.name}')">
                <label for="pokemon">Nickname:</label>
                <input type="text" name="pokemon" id="pokemon" placeholder="Create a nickname for your pokémon!" value="${pokemon.nickname}"/>
                <input type="submit" value="Edit Pokémon" />
            </form>
        </div>`
    
    divPokemonModal.innerHTML = pokemonModal
    openModal('#edit-pokemon')
}

const renderInfoModal = (pName) => {
    const pokemon = pokemonsList.find(function (x) {return x.name == pName})

    const divPokemonModal = document.querySelector("#pokemon-info")
    divPokemonModal.innerHTML = ''
    
    const hpbar = pokemon.hp / 3
    const atkbar = pokemon.atk / 3
    const defbar = pokemon.def / 3
    const spatkbar = pokemon.spatk / 3
    const spdefbar = pokemon.spdef / 3
    const speedbar = pokemon.speed / 3
    
    let pokemonModal = 
        `<div class="modal-content">
            <h1>${getFormattedPokemonName(pokemon.name)}</h1>
            <button class="btn-close" onclick="closeModal('#pokemon-info')">x</button>
            <div id="pokeStats">
                <div class="statBar" id="hpBar">HP: ${pokemon.hp}</div>
                <div class="statBar" id="atkBar">Attack: ${pokemon.atk}</div>
                <div class="statBar" id="defBar">Defense: ${pokemon.def}</div>
                <div class="statBar" id="spatkBar">Sp. Atk: ${pokemon.spatk}</div>
                <div class="statBar" id="spdefBar">Sp. Def: ${pokemon.spdef}</div>
                <div class="statBar" id="speedBar">Speed: ${pokemon.speed}</div>
            </div>
            <style>
            #hpBar {
                width: ${hpbar}%;
                background-color: #FF0000;
            }
            #atkBar {
                width: ${atkbar}%;
                background-color: #F08030;
            }
            #defBar {
                width: ${defbar}%;
                background-color: #F8D030;
            }
            #spatkBar {
                width: ${spatkbar}%;
                background-color: #6890F0;
            }
            #spdefBar {
                width: ${spdefbar}%;
                background-color: #78C850;
            }
            #speedBar {
                width: ${speedbar}%;
                background-color: #F85888;
            }
            </style>
        </div>`
    
    divPokemonModal.innerHTML = pokemonModal
    openModal('#pokemon-info')
}

const modal = document.querySelector(".modal")
modal.addEventListener("click", handleModalClose)

addPokemonsEvents()

let pokemonsList = []
renderPokemons()
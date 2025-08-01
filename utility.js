import { data } from './data.js';

    function mul32(a, b) {
  const aLow = a & 0xffff;
  const aHigh = a >>> 16;
  const bLow = b & 0xffff;
  const bHigh = b >>> 16;

  const low = (aLow * bLow) >>> 0;
  const mid1 = (aHigh * bLow) >>> 0;
  const mid2 = (aLow * bHigh) >>> 0;

  return (low + ((mid1 + mid2) << 16)) >>> 0;
}

	function murmurhash2a(values) {
      const M = 0x5bd1e995;
      const R = 24;
      let h = 2166136261 >>> 0;

      for (const word of values) {
        let k = mul32(word >>> 0, M);
        k ^= k >>> R;
        k = mul32(k, M);
        h = mul32(h, M);
        h ^= k;
      }

      h ^= h >>> 13;
      h = mul32(h, M);
      h ^= h >>> 15;
      return h;
    }

    function randomizeMove(trainer_id, move, species) {
      const out = murmurhash2a([trainer_id, species, move]) % data.kaizo_moves.length;
      if (out < 0) return (out >>> 0) % data.kaizo_moves.length;
      return out;
    }
	
	function randomizeAbility(trainer_id, species, ability_index) {
        const species_object = data.species.find(x => x.id === species);
		const ability_id = species_object.ability_ids[ability_index];
		const out = murmurhash2a([trainer_id, species, ability_id]) % data.kaizo_abilities.length;
        if (out < 0) return (out >>> 0) % data.kaizo_abilities.length;
        return out;
	}
	
	function randomizeIV(trainer_id, species, statIndex) {
		return murmurhash2a([trainer_id, species, statIndex]) % 32;
	}

    async function randomizeAndDisplay() {
      const seed = parseInt(document.getElementById('seed').value);
      const container = document.getElementById('output');
      container.innerHTML = '';

      data.trainers.forEach(trainer => {
        const div = document.createElement('div');
        div.className = 'trainer';

        const title = document.createElement('h3');
        title.textContent = trainer.name;
        div.appendChild(title);

        const teamDiv = document.createElement('div');
        teamDiv.className = 'team';

        trainer.team.forEach(mon => {
          const monDiv = document.createElement('div');
          monDiv.className = 'mon';
          const species_object = data.species.find(x => x.id === mon.species_id);
          const species_name = species_object.name;

          const move_names = mon.move_ids.map(move => {
            const mapped_move_index = randomizeMove(seed, move, mon.species_id);
            const mapped_move_id = data.kaizo_moves[mapped_move_index];
            const move_object = data.moves.find(x => x.id === mapped_move_id);
            const move_name = move_object.name;
            return move_name;
          });

		  const mapped_ability_index = randomizeAbility(seed, mon.species_id, mon.ability_index);
		  const mapped_ability_id = data.kaizo_abilities[mapped_ability_index];
          const ability_object = data.abilities.find(x => x.id === mapped_ability_id);
          const ability_name = ability_object.name;

          monDiv.innerHTML = `<strong>${species_name}</strong><br>Ability: ${ability_name}<br>Moves:<ul>${move_names.map(name => `<li>${name}</li>`).join('')}</ul>`;
          teamDiv.appendChild(monDiv);
        });

        div.appendChild(teamDiv);
        container.appendChild(div);
      });
    }

    data.trainers.reverse();

    document.getElementById("randomize").addEventListener("click", () => {randomizeAndDisplay();});
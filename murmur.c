#include <stdio.h>
#include <stdint.h>

typedef uint32_t u32;
typedef uint16_t u16;

#define MURMURHASH2A_R 24
#define MURMURHASH2A_MULTIPLIER 0x5bd1e995
#define MURMURHASH2A_SEED 2166136261U

#define murmurhash2a_init(h) { h = MURMURHASH2A_SEED; }
    
#define murmurhash2a_update(h,word)                \
{                                                  \
    u32 mmh2ak = (word) * MURMURHASH2A_MULTIPLIER; \
    mmh2ak ^= mmh2ak >> MURMURHASH2A_R;            \
    mmh2ak *= MURMURHASH2A_MULTIPLIER;             \
    h *= MURMURHASH2A_MULTIPLIER;                  \
    h ^= mmh2ak;                                   \
} while (0)

#define murmurhash2a_final(h)                      \
{                                                  \
    h ^= h >> 13;                                  \
    h *= MURMURHASH2A_MULTIPLIER;                  \
    h ^= h >> 15;                                  \
}

u32 randomizeMove(u32 trainer_id, u16 move, u16 species) {

    u32 index;
    murmurhash2a_init(index);
    murmurhash2a_update(index, trainer_id);
    murmurhash2a_update(index, species);
    murmurhash2a_update(index, move);
    murmurhash2a_final(index);

    u16 moveCount = 459;
    return index % moveCount;
}

u32 randomizeAbility(u32 trainer_id, u16 prevAbility, u16 species) {

    u32 index;
    murmurhash2a_init(index);
    murmurhash2a_update(index, trainer_id);
    murmurhash2a_update(index, species);
    murmurhash2a_update(index, prevAbility);
    murmurhash2a_final(index);

    u16 abilityCount = 107;
    return index % abilityCount;
}

int main(void) {

    u32 trainer_id = 967584427;
    u16 species_id = 124; //Jynx

    printf("Printing Lorelei Jynx\n");

    printf("MOVE_FROSTBREATH (407) => %llu\n", randomizeMove(trainer_id, 407, species_id));  //0x0197
    printf("MOVE_PSYCHICNOISE (817) => %llu\n", randomizeMove(trainer_id, 817, species_id)); //0x0331
    printf("MOVE_AURASPHERE (359) => %llu\n", randomizeMove(trainer_id, 359, species_id));   //0x0167
    printf("MOVE_LOVELYKISS (142) => %llu\n", randomizeMove(trainer_id, 142, species_id));   //0x008E

    species_id = 40; //Wigglytuff

    printf("Wigglytuff H1 (190) -> %llu\n", randomizeAbility(trainer_id, 190, species_id));
    printf("Wigglytuff H2 (92) -> %llu\n", randomizeAbility(trainer_id, 92, species_id));

    return 0;
}
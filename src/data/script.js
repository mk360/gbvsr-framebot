const fs = require("fs");
const dir = fs.readdirSync(".").filter((i) => !i.endsWith(".js"));

for (let file of dir) {
    const json = require(`./${file}`);
    for (let move of json) {
        delete move.damage;
        delete move.guard;
        delete move.startup;
        delete move.active;
        delete move.recovery;
        delete move.onCH;
        delete move.onHit;
        delete move.onBlock;
        delete move.meter;
        delete move.images;
        delete move.hitboxes;
        delete move.type;
    }
    fs.writeFileSync(file, JSON.stringify(json))
}

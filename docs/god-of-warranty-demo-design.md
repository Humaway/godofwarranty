# GOD OF WARRANTY
### Demo Design Document — *Part One: The Ward Falls*

> An Optus-themed, story-first action adventure in the style of God of War (2018).
> One HTML file. PS2 bones, modern lens. One unbroken camera take.

| | |
|---|---|
| **Document** | Demo design spec v0.1 |
| **Date** | 19 October 2026 |
| **Platform** | Desktop and mobile browsers, single self-contained `.html` |
| **Hub path** | `games/god-of-warranty.html` · thumbnail `thumbnails/god-of-warranty.png` |
| **Demo length** | ~20–25 min full path · ~15 min core path |
| **Cast** | Luka · Chase · Rue · Luke · Zane · Zee · Jarrad (and Faye, in memory) |
| **Working title alternates** | *God of Yes*, *God of Roam* |

---

## Contents

0. The Demo in One Breath
1. Vision and Pillars
2. Story and World
3. Characters
4. Demo Overview
5. The One-Take Cinematic System
6. The Demo Script — Moment by Moment
7. Combat Design
8. Progression in the Demo
9. The World — Mid-Band Redcliffe
10. Art Direction — PS2 Bones, Modern Lens
11. Audio
12. Technical Architecture
13. Settings and Accessibility
14. Build Plan
15. Appendix — Glossary, Barks, Trophies

---

## 0. The Demo in One Breath

Snow has fallen on the red cliffs for three years. Faye — the store manager everyone called **Wi-Faye** — is dead. Her 2IC, **Luka**, and the casual she hired eight months ago, **Chase**, must burn her body and carry her ashes to the highest tower in all the Nine Bands.

The demo is a single unbroken camera take. It starts on the title screen, drops through the pine canopy to Luka cutting down the tree Faye marked for her own pyre, and follows him to a funeral where every character is introduced. **Rue**, the CEO, attends by a video call he is somehow unable to hang up, and his eulogy explains the world. **Luke** and **Zane**, the repair smiths who are definitely not brothers, built the pyre. **Zee** watches from the treeline. When the fire dies, so does the ward Faye kept around the store — Head Office can see them now, the dead rise out of the snow, and the camera settles behind Luka's shoulder without ever cutting. The player fights, meets Zee properly, upgrades at the repair kiosk, defeats a comment-section troll who lives under the old Hornibrook Bridge, and walks home.

Then there's a knock at the door. A smiling man called **Jarrad** asks to speak to the manager. Luka tells him *no*. Jarrad doesn't hear it.

---

## 1. Vision and Pillars

### 1.1 Pillars

1. **One take.** From *Begin Shift* to the end card, the camera never cuts. Cutscenes are not separate movies; they are the same camera, operated by a virtual camera person who follows the actors, pulls focus, and hands control back to the player mid-stride.
2. **Grief first, jokes second.** This is a story about a man who became 2IC because nobody else could, and a kid who thinks he's only a casual. The comedy is real-workplace comedy living inside a myth that takes itself seriously.
3. **Weight.** Every axe swing has wind-up, hitstop, and consequence. Enemies react physically. The camera reacts to impacts like a person standing too close.
4. **PS2 bones, modern lens.** Low-poly models, small crisp textures, clean stable geometry (no PS1 wobble or texture warp), filmed through a modern cinema lens: shallow depth of field, bokeh, bloom, volumetric fog, film grain, heat haze, handheld movement.
5. **Optus all the way down.** The theme lives in the systems, not just on signage. Parrying is a *Price Match*. Frozen enemies play hold music. Health is shown as signal bars. Dying is a *Call Dropped*. The axe is called *The Cold Call*, and recalling it is a *Callback*.

### 1.2 Tone Rules

- **Mythic sincerity, retail humanity.** The world is Norse-epic. The people in it are retail workers who still talk like retail workers.
- **A joke never lands before the emotion does.** Maximum one joke per emotional beat, placed *after* the feeling has landed, never on top of it.
- **Silent stares are rationed.** No held silence longer than 3–4 seconds, and only a handful in the whole demo. Silence is a spice, not a meal.
- **Every character gets one unfunny moment.** Even Luke. Especially Luke.
- **No winking at the camera.** Characters never acknowledge they're in a God of War parody. The parody lives in the names, the props and the systems.

---

## 2. Story and World

### 2.1 Logline

After the death of the store manager who held their world together, a reluctant 2IC and the casual she hired must carry her ashes across a frozen, mythic Australia to the highest tower in all the Nine Bands — while Head Office, which has finally found them, sends someone who cannot be told no.

### 2.2 The Nine Bands (Norse → Optus mapping)

| God of War | God of Warranty | What it is |
|---|---|---|
| Midgard | **Mid-Band** | The mortal world. A frozen, mythic version of the Redcliffe peninsula. *The demo is set here.* |
| Asgard | **Head Office** | A realm above the clouds. No one from a store has ever been there and come back. |
| Helheim | **Helpdesk** | The realm of the dead. Currently on hold. |
| Jötunheim | **Jötun-Home** | Realm of the Giants, sealed off by Head Office long ago. Home of the highest tower. |
| Alfheim | **Fibreheim** | Realm of light. Everything glows. |
| Muspelheim | **Must-Sellheim** | Realm of fire and trials. |
| Niflheim | **No-Signal-heim** | A shifting fog maze where nothing connects. |
| Vanaheim | **Vana-Regional** | The wild regional realm, overgrown and proud of it. |
| Svartalfheim | **Smart-alfheim** | Dwarven device foundries. |
| Yggdrasil | **Yggdracell, the World Tower** | The colossal tower whose cables connect the Bands. |
| Lake of Nine | **The Lake of Nine Bars** | The great frozen bay at the centre of Mid-Band. |
| Fimbulwinter | **The Fimbul-Winter Sale** | The endless winter. It has been "ending soon" for three years. |
| Ragnarök | **End of Financial Year** | The prophesied end of all things. |
| Valkyries | **The Auditors** | Nine terrifying optional super-bosses (full game). |
| Odin's ravens | **Mystery Shoppers** | Green-eyed ravens with tiny clipboards. Head Office's spies. |
| Draugr | **The Churned** | The restless dead. Former customers. |
| Jörmungandr | **The World Cable** | A titanic undersea fibre serpent that circles the Bands. |
| Hacksilver | **SIMsilver** | Currency. Silver chips shaped like SIM card cut-outs. |
| XP | **Commission** | Spent on the KPI Tree. |
| Leviathan Axe | **The Cold Call** | Faye's frost axe. Throw it, then make the Callback. |
| Guardian Shield | **The Tempered Guardian** | A fold-out shield with a screen-protector face. |
| Blades of Chaos | **The Blades of Commission** | Luka's old weapons, chained in a locker under the floor. *Seeded only.* |
| Spartan Rage | **End-of-Month Rage** | Exactly what it sounds like. |
| "Ghost of Sparta" | **"The Ghost of Sales"** | Luka's old title, from a life he does not talk about. |

### 2.3 Lore the Demo Establishes

**Faye ("Wi-Faye").** Store manager of Store 001, the timber longhouse on the red cliffs that is both the store and home. Everyone called her Wi-Faye, because wherever you stood in that building — stockroom, counter, the car park crying on your lunch break — you were connected to her. Full bars. She hired everyone. She is never seen in the demo; she exists in a yellow handprint on a tree, a lanyard, a blank plaque, a hummed four-note tune, and everyone's silences.

**The Faraday Ward.** A ring of carved rune posts strung with copper wire around the longhouse. Faye made it. It kept the store invisible to Head Office: no signal in, no signal out. It was bound to her. When her pyre burns down, the ward dies with it.

**The Fimbul-Winter Sale.** Three years of snow. The sea is frozen halfway to the islands. Head Office keeps announcing it's ending soon.

**Helpdesk is on hold.** The dead are supposed to pass on to Helpdesk. They can't get through — all operators are busy. So they wander Mid-Band, Churned: grey, frost-bitten, eyes glowing a sick teal, still muttering the last thing they wanted. "Cancel… my… contract." "I want… to speak… to the manager." They queue in the snow for a number that is never called.

**Head Office.** Above the clouds. Unseen. Speaks only through Mystery Shopper ravens, the Auditors, and the people it sends.

**The World Cable.** An undersea fibre-optic serpent a kilometre long, older than the Bands. It carries every word anyone ever said across the water. It rarely surfaces. It surfaces for Faye.

**Faye's last wish.** Her ashes, carried to the highest tower in all the Nine Bands and scattered from the top — by Luka and Chase, nobody else.

### 2.4 Theme — *What a Yes Costs*

Every major character has a relationship with the word **Yes**:

- **Faye's yes** was chosen and generous. She said yes to everyone, including people nobody else would hire.
- **Luka's no** is protective and afraid. He said no to becoming 2IC three times. Faye said yes for him. He has been holding the weight ever since, because there was nobody else.
- **Jarrad's yes** is compelled. Zee protected him so completely from rejection that he literally cannot hear the word "no" — and a man who can never be refused can never really feel anything.
- **Chase** hasn't decided what his yes means yet. That's the game.

**Thesis:** *A yes only means something if you were free to say no.* The full game ends on Luka, at the top of the highest tower, finally saying "Yes."

### 2.5 The Full Game (context only — not built in the demo)

So the demo plants the right seeds, here is the arc it belongs to.

- **Act I — Mid-Band.** Jarrad fights Luka on the longhouse roof and is thrown off the cliff; he gets up laughing. Luka and Chase head for **the Mountain**, the tallest peak they know of, bristling with ancient transmission towers on the horizon. Zee guides them. Luke and Zane forge for them.
- **Act II — Rue.** Rue's video call is being held by Head Office as punishment for attending the funeral; his slate is wound into the roots of the Tree of Hold. Luka frees him. From then on Rue rides on Luka's belt as a talking tablet, telling stories on the boat (the *Prepaid*), resuming them after every fight ("Now, where was I…"). The Mountain's summit is not the highest tower.
- **Act III — Helpdesk.** Chase falls ill: he can hear every signal in the Bands at once. To save him, Luka must open the locker under the floor and take back the **Blades of Commission** — and admit who the Ghost of Sales was. Zee's secret comes out: Jarrad is the rep she trained and loved like a son, and the curse is hers. The one thing she forgot to ward him against was a single customer phrase — *"I'll think about it."* Chase's arrow carries those words, and Jarrad feels pain, cold and snow for the first time.
- **Act IV — Jötun-Home.** The highest tower. A mural shows Faye foresaw everything, and that Chase's real name, in the old tongue, is **Lo-Fi**. The ashes are scattered. Luka says yes. Somewhere in the clouds, Head Office begins planning for End of Financial Year.

### 2.6 Motif Tracker

Each motif is planted in the demo and paid off in the full game. The build must preserve every plant listed here.

| Motif | Plant in the demo | Payoff in the full game |
|---|---|---|
| **"Casual."** | Luka calls Chase "Casual" all demo. Chase corrects him once: "It's Chase." | The first time Luka says "Chase" — at the worst possible moment. |
| **The hand** | At the embers, Luka's hand rises to Chase's shoulder, hovers, withdraws into a fist. Chase never sees it. | At the top of the tower, it lands. |
| **Faye's four notes** | Chase hums a four-note tune at the embers. Luka: "She hummed that at home." It's also the hidden wind-chime puzzle and Chase's arrow-combo melody. | Chase finishes the song as a Pudding track; it plays over the ash scattering. |
| **"Don't be sorry. Be on time."** | Luka to Chase, who is late to the tree. | Chase says it back to Luka. |
| **Repair Ticket #0001** | Faye's ashes travel in a sealed repair bag, ticket filled in by Zane: *Return to: the highest tower.* | Luka tears the seal at the top. |
| **"For the record, I didn't make JARVIS."** | Rue's first line once the call connects is a defensive non-sequitur. | Late-game, sincere: "For the record… I'm glad I came." |
| **"I'd like to speak to the manager."** | Moaned by the Churned all demo. Then said, smiling, by Jarrad. | Luka's final words to Head Office. |
| **The locker under the floor** | When Chase hides under the floorboards, the camera passes a chained locker with a red glow and "COMMISSION" scratched into it. | The Blades of Commission. |
| **The back of Chase's badge** | During one shallow-focus shot the camera lets the *player* read the back of Chase's name badge, in Faye's handwriting: **LO-FI**. Chase says there's nothing on the back. | The mural in Jötun-Home. |
| **"No."** | Zee warns Luka not to tell the stranger no. He does anyway. | Luka learns to say something else. |

---

## 3. Characters

> **Note on likeness.** Luka, Chase and Rue follow the looks already established in your other Optus games. Luke, Zane, Zee and Jarrad are written here as clear silhouettes and props; swap in details from reference photos before modelling.

All models are low-poly segmented rigs built from primitives in code (see §10.5). Target hero budget is 1,500–3,000 triangles per character.

---

### 3.1 LUKA — *The 2IC*

| | |
|---|---|
| **Role** | Player character. Kratos parallel. |
| **Look** | Ponytail, stubble. Navy Yes polo under a heavy teal-grey wool cloak with a fur collar. Leather bracers. Black trousers. Black-and-white sneakers wrapped in fur and leather strapping for the snow (the sneakers are the joke; never mention it). Staff lanyard worn like a torc — badge reads **LUKA · 2IC**, with an "Ask me about Yes" pin gone dull. A satchel at his hip holding Faye's ashes. |
| **Silhouette** | Broad, heavy, slightly forward-leaning. Cloak and ponytail give motion. |
| **Voice** | Low, flat, few words. Never swears. Australian. When he says more than one sentence, it matters. |
| **Wants** | To keep everyone safe — by keeping them at arm's length. |
| **Fears** | Hurting the people he cares about. Becoming the Ghost of Sales again. |
| **Wound** | He said no to being 2IC three times. Faye said yes for him. He took the job because there was nobody else who could, and he has never put it down. |
| **Arc (full game)** | From a protective *no* to a chosen *yes*. |
| **In the demo** | Cuts the marked tree, lights the pyre, collects the ashes, nearly touches Chase's shoulder, fights, tells Jarrad no. |
| **Signature lines** | "Casual." · "Focus." · "Don't be sorry. Be on time." · "I was not supposed to be the one who stayed." · and exactly once: "Good." |
| **Combat** | Heavy, deliberate, devastating. See §7. |

---

### 3.2 CHASE — *The Casual*

| | |
|---|---|
| **Role** | Companion. Atreus parallel. |
| **Look** | Messy wavy brown hair, moustache, focused frown. Navy Yes polo under a battered puffer vest with a fur-lined hood. Silver bracelet on the right wrist. Headphones around his neck. A quiver made from a long phone-accessory box. **The Treble Bow**: two extended selfie sticks as limbs, gaffer-taped to a riser, strung with a bass string. |
| **Voice** | Quick, earnest, chatty, funny when nervous. Notices things. Hums constantly. |
| **Wants** | For Luka to see him as more than a casual. |
| **Fears** | Wasting his potential. Being the one who wasn't enough. |
| **Secret (full game)** | He can hear music in static — the signal the towers sing. Faye knew. His real name is Lo-Fi. |
| **Music** | He makes music as **Pudding**. In-world, his hums are the score's motifs; his arrows ring in pitch; a *Pudding — Demo Tape* is a collectible. |
| **In the demo** | Late to the tree. Carries the log. Lights the pyre with a novelty lighter. Hums Faye's tune. Fights beside Luka, shoots the wrong thing at least once, saves Luka once, hides under the floor at the end. |
| **Signature lines** | "It's Chase." · "I'm a casual. I do Saturdays." · "That's a yes." · "Is it weird that the dead customers still want to speak to the manager?" |

---

### 3.3 RUE — *The CEO (Currently on a Call)*

| | |
|---|---|
| **Role** | Storyteller, conscience, comic warmth. Mímir parallel — except he keeps his head, and lives in a cracked tablet instead. |
| **Look** | Short parted silver-grey hair, warm smile, navy blazer. Always seen on a cracked slate-like tablet in a picture-in-picture video-call view. Behind him: a Head Office window full of clouds, and on a shelf, a framed photo of a 19-year-old Rue outside Trinity College, 1987. |
| **Voice** | Irish, warm, unhurried, a natural raconteur. Calls everyone "lad". Self-deprecating about Head Office. |
| **The call** | He has been stuck on this call "for a hundred and nine quarters". Head Office never let him hang up. Nobody knows why. He can hear everything. |
| **Visual treatment** | His feed renders to a tiny render target with video-compression artefacts: macro-blocking, colour banding, occasional frozen frames when he "lags", mouth moving a beat behind the audio. His voice runs through a telephone EQ. |
| **In the demo** | Joins the funeral by call, explains the world in the eulogy, and is cut off by Head Office when the ward falls. |
| **Signature lines** | "For the record, I didn't make JARVIS." · "She said, 'Luka will say no. Tell him I said yes.'" · "I can hear you, Chase." |

---

### 3.4 LUKE — *Repair Smith*

| | |
|---|---|
| **Role** | Upgrades, gruff comic relief, secret soft heart. Brok parallel. |
| **Look** | Big frame. Blue anti-static smock and blue nitrile gloves (his "blue" is the uniform). A magnifier loupe headband pushed up on his forehead. A mug that says WORLD'S OKAYEST TECH. |
| **Voice** | Loud, blunt, a bit crude, quick to laugh, quicker to shout. |
| **Running bit** | Licks screen protectors to "activate the adhesive". Zane gags every time. |
| **In the demo** | Built the pyre from the old display table. Runs the repair kiosk where the upgrade tutorial happens. His one unfunny moment: realising the axe Luka carries is the one he forged for Faye. |
| **Signature lines** | "Watch the corner. WATCH THE CORNER." · "Course she did." · "Oi, Casual. Your bow's held together with tape." |

### 3.5 ZANE — *Repair Smith (Not His Brother)*

| | |
|---|---|
| **Role** | Upgrades, precise and anxious foil to Luke. Sindri parallel. |
| **Look** | Neat, narrow, spotless apron, glasses, face mask pulled down to his chin, a microfibre cloth always in hand. |
| **Voice** | Polite, clipped, quietly passive-aggressive. Precise about everything. |
| **Running bit** | Wipes down anything anyone else touched, including things you'd think couldn't be wiped. |
| **In the demo** | Sanitised the pyre. Wrote the repair ticket for Faye's ashes. His one unfunny moment: the ticket. |
| **Signature lines** | "I sanitised it." · "We made that for her. Not for you. No offence." · "Estranged business partners." |

**Luke & Zane together:** they share one cart and one reputation. Everyone assumes they're brothers. They are not. They have stopped correcting people, and also have not.

> **Chase:** So how long have you two been brothers?
> **Luke & Zane:** We're not brothers.
> **Luke:** Business partners.
> **Zane:** *Estranged* business partners.
> **Luke:** We share a cart.
> **Zane:** Against my will.

---

### 3.6 ZEE — *The Witch of the Woods*

| | |
|---|---|
| **Role** | Mysterious helper with a hidden agenda. Freya parallel. |
| **Look** | Tall, a long hooded cloak in moss greens and storm greys. Old lanyard cords braided into her hair. A ring of cracked Head Office access cards at her belt, one marked ALL ACCESS. A walking staff with an old pager hanging from it as a charm. |
| **Companion** | **Hildis-Vinnie**, a giant wombat the size of a small car — an Ice Age diprotodon who is mostly offended by everything. |
| **Voice** | Calm, warm, knowing. Answers questions with better questions. A sadness underneath. |
| **Past (full game)** | Former Queen of the Auditors, exiled from Head Office and bound to Mid-Band. She trained Jarrad and loved him like a son, and protected him so completely from rejection that she broke him. |
| **Magic** | Fixes things with "a gentle reset" — a touch, a soft chime, rune-light. |
| **In the demo** | Glimpsed at the treeline during the funeral (only Chase sees her). Met properly on the path, healing Hildis-Vinnie after Chase's stray arrow. Warns Luka about the stranger. |
| **Signature lines** | "Let's try a gentle reset." · "Nobody does. Until the queue gets long." · "Don't tell him no. He won't hear it." · "It means say something else." |

---

### 3.7 JARRAD — *The Stranger*

| | |
|---|---|
| **Role** | Antagonist. Baldur parallel. |
| **Look** | Neat hair, big easy smile. A crisp shirt with rolled sleeves in the snow — he doesn't feel the cold. Forearms tattooed with runes that, read closely, are sales scripts. Name badge: **JARRAD · HERE TO HELP!** A volleyball under one arm (his signature throw in the full fight). |
| **Voice** | Bright, relentless, upbeat sales patter. Constant upward inflection. Never stops smiling, which is the scary part. |
| **The curse** | He cannot hear the word "no". Not won't — *can't*. It doesn't reach him. And so nothing does: no pain, no cold, no joy. |
| **Wants** | To feel something. Anything. |
| **In the demo** | Four lines at the door at the very end. That's all he needs. |
| **Signature lines** | "G'day! Is this the 2IC?" · "Great! So it is." · "I'd like to speak to the manager." · "Then I'll speak to you." |

---

### 3.8 FAYE — *Wi-Faye* (never seen)

Represented only by: the yellow handprint on the marked tree, her staff lanyard (**FAYE · STORE MANAGER**), her empty chair at the longhouse, three years of Best of the Month plaques with her name and one blank plaque, the four-note tune everyone remembers her humming, the Cold Call she once carried, and the ward that dies with her. No voice, no face, no flashback. The absence is the character.

---

## 4. Demo Overview

### 4.1 Beat Map

| # | Beat | Location | Mode | Time | Purpose |
|---|---|---|---|---|---|
| 0 | **Begin Shift** | Sky above the bay → pine canopy | Title / cine | 0:30 | Title over a live vista; camera descends to Luka without a cut. |
| 1 | **The Marked Tree** | Faye's grove | Cine → light interactive | 2:30 | Introduce Luka, Faye's absence, Chase. Teach movement and the basic swing. |
| 2 | **The Carry** | Grove → longhouse yard | Interactive walk-and-talk | 1:30 | Co-op log carry. Chase and Luka's dynamic. |
| 3 | **Wi-Faye** | Longhouse yard, the pyre | Cine (one long take) | 5:30 | Funeral. Introduce Luke, Zane, Rue, Zee. Rue's eulogy explains the story. World Cable surfaces. The hand. |
| 4 | **The Ward Falls** | Longhouse yard, night | Cine → **combat** | 4:00 | The ward dies, Rue is cut off, the Churned rise. Combat tutorial in three waves. |
| 5 | **The Kiosk** | Luke & Zane's cart | Explore + upgrade | 2:00 | Upgrade tutorial. Not-brothers. Luke realises whose axe it is. |
| 6 | **The Wombat** | Zee's clearing | Cine | 2:00 | Meet Zee properly. The warning. |
| 7 | **The Cliff Path** | Path to the Hornibrook | Explore | 2:30 | Easter eggs, ravens, chime puzzle, vistas, walk-and-talk. |
| 8 | **The Queue** | Hornibrook ruins | **Combat** | 2:30 | The silent queue of the dead turns around. Mixed-enemy fight; Runic Promos and Rage. |
| 9 | **Dodgy Hamarr** | Under and on the bridge | **Boss** | 4:00 | Comment-section troll boss. Chase's reckless moment; "Good." |
| 10 | **Not Ready** | Bridge → shortcut → longhouse | Walk-and-talk | 1:30 | The argument. The almost-apology. |
| 11 | **The Knock** | Longhouse | Cine → end card | 2:00 | Luka alone with the blank plaque. Chase under the floor. Jarrad. |

**Total:** ~25 minutes on the full path.

### 4.2 Scope Tiers

Build Core first, end to end, then layer Stretch on top. Core alone is a complete demo.

| Tier | Includes |
|---|---|
| **Core** | Beats 0, 1, 2, 3, 4, 6, 9, 11. Churned + Hold-Music Churned + Brute. Cold Call, shield, Chase arrows. Shortcut straight from Zee's clearing to the bridge. |
| **Stretch** | Beat 5 (kiosk upgrades), 7 (full cliff path, chime puzzle, ravens), 8 (the Queue fight, 1-Star Reviewers), 10 (full walk home), Runic Promos, trophies, end-card stats. |
| **Polish** | Post-credits stinger, PS2 480p mode, TTS voices, photo mode. |

### 4.3 Flow

```
 [TITLE VISTA] ──descend──▶ [MARKED TREE] ──carry──▶ [PYRE: WI-FAYE]
                                                         │ smoke wipe (time skip to night)
                                                         ▼
                                               [EMBERS · THE HAND]
                                                         │ ward fails
                                                         ▼
                                       ┌──────── [COMBAT I: THE WARD FALLS] ────────┐
                                       │                                             │
                                       ▼                                             │
                            [KIOSK · upgrades]  (stretch)                            │ (core skips)
                                       │                                             │
                                       ▼                                             ▼
                              [ZEE · THE WOMBAT] ───▶ [CLIFF PATH · eggs] ───▶ [COMBAT II: THE QUEUE]
                                                                                     │
                                                                                     ▼
                                                                         [BOSS: DODGY HAMARR]
                                                                                     │
                                                                                     ▼
                                                          [WALK HOME] ──▶ [THE KNOCK] ──▶ [END CARD]
```

---

## 5. The One-Take Cinematic System

This is the heart of the demo. The goal: it should feel like a camera operator is physically present, following Luka and Chase through every moment — walking when they walk, leaning in when someone speaks quietly, flinching when a troll hits the ground — and that story and play are one continuous piece of film.

### 5.1 Rules of the Take

1. **One camera object, ever.** There is exactly one `THREE.PerspectiveCamera`. Gameplay and cinematic modes are *targets* the operator moves toward, never separate cameras to switch between.
2. **No cuts, no fades** — with one exception: the fade from black after *Call Back* on death.
3. **The HUD is diegetic or absent.** During cinematics the HUD fades to 0 over 0.5 s. It fades back in over 0.8 s as control returns. No letterbox bars — bars read as a cut.
4. **Control returns mid-motion.** The player gets control while the camera is still settling and Luka is often still walking. Nothing ever "snaps".
5. **Time skips are hidden, never cut.** Every jump in time or position happens behind an occluder that fills the frame (smoke, a tree trunk, Luka's cloak). See §5.5.
6. **Composition is deliberate.** Thirds, lead room, foreground framing, three depth layers wherever possible (foreground blur, sharp subject, soft background). No static CCTV angles.
7. **The camera is a person.** It has inertia, it breathes, it reacts, it overshoots slightly and corrects. It never moves with robotic linearity.
8. **Pacing.** Silent holds are 3–4 s max and rare. If a moment needs weight, move the camera slowly instead of freezing it.

### 5.2 The Virtual Camera Operator

The operator is a small physics rig plus a lens. Everything else — cinematics and gameplay alike — feeds it targets.

```js
const Operator = {
  pos:   new Spring3({ omega: 3.2, zeta: 0.92 }), // where the camera body is
  aim:   new Spring3({ omega: 4.0, zeta: 0.95 }), // the point being looked at
  roll:  new Spring1({ omega: 2.0, zeta: 1.0 }),  // dutch angle, used sparingly
  lens: {
    focalMM:   35,    // drives FOV
    fStop:     2.8,   // drives depth-of-field strength
    focusDist: 3.0,   // metres, animated by the focus puller
    sensorH:   24     // full-frame 36x24 mm
  },
  handheld: { intensity: 0.35, seed: 7 },  // 0 = tripod, 1 = run-and-gun
  trauma: 0                                 // impact shake, decays every frame
};
```

**Springs.** Critically damped (or slightly under-damped) second-order springs: `a = -2ζω·v - ω²·(x - target)`. Gameplay uses stiff springs (ω ≈ 8–10). Cinematics use soft springs (ω ≈ 2.5–4, ζ ≈ 0.9), which gives the gentle overshoot of a real operator who has to stop a moving camera.

**Lens → FOV.** `vFOV = 2·atan(sensorH / (2·focalMM))`. The vocabulary:

| Lens | vFOV | Use |
|---|---|---|
| 18 mm | 67° | Boss arenas, vistas |
| 24 mm | 53° | Establishing, group shots, gameplay (≈26 mm) |
| 35 mm | 38° | Walk-and-talk |
| 50 mm | 27° | Dialogue two-shots |
| 85 mm | 16° | Close-ups, the hand, the handprint |
| 135 mm | 10° | Long-lens voyeur shots (Zee in the trees) |

Focal length changes animate smoothly (a zoom), but should be used like a real operator: mostly static per move, with occasional slow "creeping" zooms on emotional beats.

**Depth of field.** The lens feeds the DOF shader with physically based circle of confusion:

```
CoC(px) = | (f² / (N · (S − f))) · (D − S) / D | · (imageHeightPx / sensorH)
  f = focal length (m), N = f-stop, S = focus distance (m), D = pixel depth (m)
```

Clamp to a max CoC (12 px at 1080p, scaled to resolution). Gameplay runs at f/4–5.6 (gentle background softness, like GoW). Cinematics drop to f/1.8–2.8 for creamy bokeh.

**The focus puller.** A separate track that drives `focusDist`:

- **Auto mode:** each frame, raycast from the camera to a *focus subject* (a bone: `luka.head`, `chase.eyes`, `rue.slate`). Smooth with a spring (ω ≈ 6). Snow particles crossing the near field naturally bloom into bokeh.
- **Pull:** `focus.pull(subject, seconds)` — an eased transfer of focus from one subject to another. Rack focus is the main way the take "cuts" between speakers.
- **Hunt:** when a subject moves suddenly, the auto mode lags ~150 ms and slightly overshoots before settling — the tiny "breathing" of a real focus puller. Keep it subtle.

**Handheld layers.** Added on top of the spring output, scaled by `handheld.intensity`:

| Layer | Freq | Pos amplitude | Rot amplitude | Notes |
|---|---|---|---|---|
| Breathing | 0.22 Hz | 6 mm vertical | 0.12° pitch | Always on, even on "tripod" shots (×0.3) |
| Drift | 0.35 Hz | 12 mm | 0.25° yaw/pitch | 3-octave simplex noise |
| Footsteps | stride freq | 15 mm vertical | 0.2° roll | Only when the operator is "walking" (camera speed > 0.4 m/s) |
| Micro-jitter | 6 Hz | — | 0.05° | Only at intensity > 0.6 (combat, chaos) |
| Trauma | — | `trauma²` × 8 cm | `trauma²` × 2.5° | Impacts add trauma (0–1), decays at 1.6/s |

**Framing grammar** (used by the scene scripts):

- `track(anchor, offset)` — follow a bone or actor at an offset in that actor's local space.
- `orbit(center, fromAngle, toAngle, radius)` — slow arc around a subject or group.
- `crane(dy)` — rise or descend, keeping the aim point.
- `push(dist)` / `pull(dist)` — dolly in or out along the view axis.
- `whip(target, seconds)` — fast pan with motion blur, used rarely (Zee vanishing).
- `favour(speaker)` — in a dialogue, arc 15–40° to favour whoever is speaking and rack focus to them. Never cross the 180° line mid-line; cross only during a pause, with a motivated move.
- `hold(seconds)` — keep the current framing, handheld still active.

### 5.3 Gameplay Camera Specification

| Parameter | Exploration | Combat (≥3 enemies within 8 m) | Aiming | Boss |
|---|---|---|---|---|
| Shoulder offset (right) | 0.55 m | 0.6 m | 0.45 m | 0.8 m |
| Height (pivot above feet) | 1.55 m | 1.6 m | 1.6 m | 1.95 m |
| Distance behind | 2.1 m | 2.6 m | 1.3 m | 3.6 m |
| Lens | 26 mm | 24 mm | 32 mm | 20 mm |
| f-stop / focus | f/5.6 on Luka | f/5.6 on Luka | f/4 on reticle hit | f/8 on boss |
| Spring ω | 9 | 10 | 14 | 8 |

- **Collision:** sphere-cast (r = 0.2 m) from the pivot to the desired position; pull in fast (ω 20) and ease back out slowly (0.6 s). If the camera is closer than 0.6 m to Luka, dither-fade his mesh.
- **No auto-recentering in combat.** A 180° quick turn button exists instead.
- **Combat framing assist:** when the nearest attacking enemy is behind Luka, bias the aim 8° toward it (subtle; the off-screen indicators do the real work).
- **Aim:** holding Aim swings the camera to the tighter shoulder framing over 0.18 s and shows the reticle.

### 5.4 Handoffs

**Gameplay → cinematic.** Triggered by a volume or event.

1. The director reads the *current* camera pose as the first keyframe (`from: 'current'`). Nothing jumps.
2. Player input fades to zero over 0.4 s. Luka finishes his current step and auto-walks to his *mark* using normal locomotion (not a teleport), steering around obstacles.
3. HUD fades out. Music crossfades to the scene cue.
4. The operator's springs soften (ω eases from gameplay to cinematic values over 1 s), so the camera "relaxes" from a tight follow into a performed move.

**Cinematic → gameplay.** The final move of every scene is a `handoff` instruction:

1. Each frame, compute the gameplay camera pose for Luka's current state.
2. Blend the operator's targets from the scene's last pose to that live pose with smootherstep over 1.2 s (position lerp, aim lerp, lens lerp, DOF lerp).
3. Input weight ramps 0 → 1 over the same window, so the player's stick input gradually takes over Luka's walk.
4. **Soft handoff:** in scenes marked `handoff: 'soft'`, if the player pushes the stick during the final 1.5 s, the blend starts immediately. Players who are ready never wait.
5. HUD fades in; the first prompt (if any) appears 0.6 s after control.

### 5.5 Hidden Wipes and Time Skips

The demo needs a few jumps (the pyre burning down to embers at night; the walk home). Each one is a **wipe**: the camera passes behind something that fills ≥95% of the frame for at least 6 frames, and the world changes while hidden.

| Wipe | Where | What changes behind it |
|---|---|---|
| **Canopy** | Beat 0 | Title vista → grove (the camera descends through dense pine boughs). |
| **Smoke** | Beat 3 | The camera cranes up with the pyre smoke, which billows to fill frame. Time jumps from dusk to night, fire to embers; Luke, Zane leave; sky grade swaps. |
| **Cloak** | Beat 10 | The camera passes tight behind Luka's cloak as he climbs the shortcut ladder; on the other side, they're at the longhouse gate. |

Implementation: the director marks a `wipe()` step; the designer guarantees occlusion with a dedicated occluder (a dense smoke particle wall that fades in, or real geometry). A debug overlay shows frame coverage; if coverage < 95%, flash red in the dev build.

### 5.6 Directing Actors

- **Marks.** Every scene defines named marks (`pyre_head`, `pyre_left`). Actors walk to marks with full locomotion and turn-in-place animations.
- **Look-at IK.** Head and chest turn toward a target with limits (head ±70°, chest ±25°), driven by springs. Characters look at whoever is speaking, unless the script says otherwise — Luka often deliberately doesn't.
- **Eyes and blinks.** Face textures have eye and lid frames; blink every 2.5–6 s (random), plus forced blinks on head turns.
- **Lip flap.** The mouth swaps between 4 painted mouth frames (closed, small, open, wide) driven by the voice babble's amplitude envelope. The jaw bone opens slightly with the same signal.
- **Breath.** Visible breath puffs in the cold: a small particle burst on every exhale (every ~3 s at rest, faster after combat) and on every spoken line.
- **Gestures.** A small library of additive upper-body gestures (`shrug`, `nod`, `point`, `hand_to_satchel`, `rub_neck`, `reach_shoulder`, `withdraw_fist`) layered over idle/locomotion.
- **Secondary motion.** Cloaks, the ponytail, lanyards and Chase's headphone cable use verlet chains so every stop and turn reads with weight.

### 5.7 The Scene Script DSL

Scenes are data. Arrays run sequentially; `par()` runs steps in parallel; `at(t, step)` offsets a step inside a `par`.

```js
scene('the_hand', { checkpoint: 'pyre_embers', hud: false, handoff: null }, [
  par([
    cam.track({ anchor: 'chase.head', offset: [-0.6, 0.05, 1.4], lens: 50, fStop: 2.0, blend: 2.5 }),
    focus.pull('chase.eyes', 1.0),
  ]),
  say('chase', "I don't think I'm ready for this, Luka. I'm a casual. I do Saturdays."),
  wait(0.4),
  par([
    act('luka', 'reach_shoulder', { dur: 1.6 }),
    at(0.3, focus.pull('luka.hand_r', 0.9)),
    cam.push({ dist: 0.35, dur: 3.0, ease: 'inOutSine' }),
  ]),
  wait(1.0),
  par([
    act('luka', 'withdraw_fist', { dur: 1.1 }),
    at(0.5, focus.pull('luka.head', 0.8)),
  ]),
  say('luka', "Get some sleep. We leave at first light."),
  say('chase', "Okay."),
  cam.hold(1.5),
]);
```

Core step types: `cam.*`, `focus.*`, `lens(mm, s)`, `fstop(n, s)`, `say(actor, line, opts)`, `act(actor, gesture|anim, opts)`, `walk(actor, mark)`, `look(actor, target)`, `wait(s)`, `wipe(occluder)`, `music(cue, fade)`, `sfx(name)`, `spawn(...)`, `setFlag(...)`, `handoff({ soft })`, `timeScale(x, s)`.

**Debug tools (dev build):** a timeline scrubber overlay (pause, step, jump to any step), a free-fly camera, a "show marks" toggle, and a coverage meter for wipes.

### 5.8 Dialogue, Subtitles and Name Cards

- **Subtitles:** bottom centre, max 2 lines, ~42 characters per line, speaker name in their colour. Luka teal, Chase yellow, Rue warm white, Luke blue, Zane mint, Zee sage green, Jarrad bright coral. Fade 150 ms.
- **Line timing:** `max(1.8 s, words × 0.32 s + 0.6 s)`, overridable per line.
- **Walk-and-talk:** conversations attached to path segments. If combat starts mid-conversation, the line in progress is cut off naturally ("—"), and after combat the speaker resumes with a recovery line ("Anyway — as I was saying —").
- **Barks:** short combat and exploration lines, with priority, cooldown, and never the same line twice in a row.
- **Name cards (toggle, on by default for the demo):** the first time each character is properly framed, a small lower-third card fades in, etched like a runestone and lit as if by the scene's light. Name, then a role in smaller text:
  - **LUKA** · 2IC
  - **CHASE** · Casual
  - **LUKE** · Repair Smith
  - **ZANE** · Repair Smith (Not His Brother)
  - **RUE** · CEO (Currently on a Call)
  - **ZEE** · ??? (later updates to *The Witch of the Woods*)
  - **JARRAD** · Here to Help!

---

## 6. The Demo Script — Moment by Moment

**How to read this section.** Each beat lists its location and mode, then numbered moments. Every moment has:

- **CAM** — lens, f-stop, move and focus.
- **ACTION** — what the actors do.
- **LINES** — dialogue (O.S. = off screen).
- **SOUND** — music cue and key effects.

Remember: there are no cuts anywhere in this section. Each moment flows straight into the next.

---

### BEAT 0 — *Begin Shift*

**Location:** high above the Lake of Nine Bars, blue hour · **Mode:** title screen

**0.1 — The vista (title screen idles here)**
- **CAM:** 120 m altitude, 18 mm, f/8. A very slow lateral drift along the coast (0.4 m/s), handheld 0.1.
- **ACTION:** Snow falls past the lens; near flakes bloom into soft bokeh discs. Below: the frozen bay with ice floes, the snow-dusted red cliffs, a single timber longhouse with chimney smoke, pine forest. On the horizon, the Mountain, its ancient transmission towers blinking red. Far out on the ice, a long shape breaks the surface and sinks again, too far to make out.
- **UI:** **GOD OF WARRANTY** in carved stone serif, frost on its edges, a thin teal glow in the cuts. Under it, small: *Part One — The Ward Falls*. Menu: **Begin Shift** · **Settings** · **Credits**.
- **SOUND:** Low choir drone, wind. Every ~40 s a solo cello plays the four-note motif once.
- **TECH:** All shaders are warmed up behind this screen (§12.4). The title must never stutter.

**0.2 — The descent**
- **ACTION:** On *Begin Shift*, the title letters crumble into snow and are taken by a gust toward the land.
- **CAM:** The camera follows the gust: crane down and forward over the cliffs, 18 → 35 mm over 8 s, into the pine canopy. **Canopy wipe** — dense boughs fill the frame for a moment, snow dumping off branches across the lens.
- **SOUND:** Wind rushes, then muffles under the trees. The drone resolves into a single low string note.

---

### BEAT 1 — *The Marked Tree*

**Location:** Faye's grove, late afternoon · **Mode:** cinematic → light interactive

**1.1 — The handprint**
- **CAM:** Emerging from the canopy straight into an 85 mm close-up, f/1.8. A yellow handprint painted on pine bark, frost along its edges.
- **ACTION:** Luka's hand enters frame and rests over the print. His fingers are slightly bigger than hers. Breath fog drifts through frame from the right. Hold 2.5 s.
- **SOUND:** Wind in pines. A distant raven.

**1.2 — Luka**
- **CAM:** Focus racks from his fingers up his arm to his face as the camera tilts up and drifts left (50 mm, f/2).
- **ACTION:** Luka's eyes, tired. **Name card: LUKA · 2IC.** A staff lanyard is tied around the trunk — **FAYE · STORE MANAGER**, frosted over. He unties it slowly, winds it around his hand, and puts it in his satchel.
- **LINES:** None.

**1.3 — The chop (control returns)**
- **CAM:** Drifts back and right into the exploration framing. **Soft handoff.**
- **ACTION:** Prompt: **Move** (left stick / WASD). A chop mark is cut low on the trunk, 3 m away. Prompt: **Swing** (LMB / R1 / Light button). Luka uses a plain wood axe here; the Cold Call waits at the pyre.
- **FEEL:** Three swings. Each hit: chips fly, a 70 ms hitstop, camera trauma 0.15, snow slides off the branches above.
- **Plant:** On the second swing, ravens burst from the canopy. One stays behind on a branch: a single **green glowing eye**, a tiny clipboard tied to its leg. It tilts its head, makes a scratchy scribbling sound, and flies up toward the clouds. Not collectable — it's the first sign Head Office is near.

**1.4 — The fall**
- **ACTION:** On the third swing the tree groans. Input fades out; Luka steps back on his own.
- **CAM:** Pulls back and cranes up (24 mm) to frame the fall. The trunk comes down, raising a big plume of powder snow. The operator flinches (trauma 0.35) and re-frames. Snow powder drifts across the lens as near-field bokeh.
- **SOUND:** Creak, crack, a deep thump that the music answers with a single low drum.

**1.5 — Chase**
- **CAM:** The operator "hears" a voice behind and turns (0.8 s pan) to find Chase wading through thigh-deep snow, a cardboard box under his arm.
- **ACTION:** **Name card: CHASE · Casual.**
- **LINES:**
  > **CHASE:** Sorry! Sorry — I know. The snow's up to my — Luke says the pyre's "structurally sound", and Zane says it's "structurally a fire hazard", which, I mean, that's sort of the point of a —
  > **LUKA:** Don't be sorry. Be on time.
  > **CHASE:** …Right. Yep.
- **CAM:** Favour Chase (50 mm). The handprint on the fallen trunk sits soft in the foreground. Chase sees it.
  > **CHASE:** *(quiet)* That's her tree.
  > *(beat)*
  > **LUKA:** Take the other end, Casual.
  > **CHASE:** It's Chase.
  > *(Luka looks at him. 2 s.)*
  > **LUKA:** Take the other end.

---

### BEAT 2 — *The Carry*

**Location:** grove → longhouse yard · **Mode:** interactive walk-and-talk

**2.1 — Lift**
- **ACTION:** Prompt: **Lift** (Interact). Luka and Chase hoist the log. Movement slows to 1.4 m/s; the player steers; Chase steers his end with a slight lag. Turn too sharply and Chase protests ("Little warning before the turns?").
- **CAM:** A Steadicam-style *leading* shot: the operator walks backwards ahead of them at 35 mm, framing both men and the log, handheld 0.4 with visible footstep bob. Footprints trail behind them in the snow.

**2.2 — Walk-and-talk**
> **CHASE:** Eight months. She hired me eight months ago. Do you know what she asked me in the interview?
> **LUKA:** No.
> **CHASE:** "Can you hold a conversation and a phone at the same time?" And I said yes. And then I dropped the phone.
> *(beat)*
> **CHASE:** She hired me anyway.
> **LUKA:** She hired everyone anyway.
> **CHASE:** …Is that a compliment?
> **LUKA:** It's a fact.
> *(They walk. Chase hums something random under his breath.)*
> **CHASE:** What did she ask you? In your interview?
> **LUKA:** *(2 s)* She didn't. I came in to buy a charger.
> **CHASE:** And?
> **LUKA:** And I left with a lanyard.

**2.3 — The yard reveal**
- **CAM:** As the trees open, the operator swings around from leading to behind them and cranes up (24 mm), revealing the yard below — see Beat 3.

---

### BEAT 3 — *Wi-Faye*

**Location:** longhouse yard, dusk → night · **Mode:** one long cinematic take (~5:30) · **Checkpoint:** `pyre_start`

**3.1 — The yard**
- **CAM:** 24 mm crane, f/4.
- **ACTION:** The full reveal. **Store 001**: a timber longhouse whose front is carved like a shopfront, with the runes ᛃᛖᛊ (YES) cut into the lintel. Around the yard, the **Faraday Ward**: a ring of carved rune posts strung with copper wire, humming faintly, the runes softly lit. The **pyre** stands near the cliff edge, built on the frame of the old display table (six device bays) and stacked with split timber and candles. Beyond it: the red cliffs and the frozen bay, the sun low and orange through cloud, shadows teal.
- **SOUND:** Music cue **"Wi-Faye"** begins: solo low strings, sparse.

**3.2 — Luke and Zane**
- **CAM:** Orbits slowly left around the pyre (35 mm), favouring each smith as he speaks.
- **ACTION:** They guide the log into place. **Name cards: LUKE · Repair Smith**, then **ZANE · Repair Smith (Not His Brother)**.
- **LINES:**
  > **LUKE:** Watch the corner. WATCH THE CORNER.
  > **ZANE:** I'm watching the corner. I am always watching the corner. One of us has to.
  > *(The log drops into place. Luke slaps the display-table frame.)*
  > **LUKE:** Built it off the old display table. Six device bays. She'd have liked that. *(beat)* Room for everyone.
  > **ZANE:** I sanitised it.
  > **LUKE:** It's a pyre, Zane.
  > **ZANE:** And now it's a clean pyre.
  > **CHASE:** *(nervous, filling the silence)* So how long have you two been brothers?
  > **LUKE & ZANE:** We're not brothers.
  > **LUKE:** Business partners.
  > **ZANE:** *Estranged* business partners.
  > **LUKE:** We share a cart.
  > **ZANE:** Against my will.
  > **LUKA:** Enough.
- *(Silence. Everyone straightens.)*

**3.3 — Faye**
- **ACTION:** Luka walks into the longhouse. The operator does **not** follow him in — it waits outside, respectfully, holding on the doorway (50 mm, f/2), the others soft in the foreground. Luka comes back out carrying Faye's body, wrapped in a shroud stitched from old navy and teal staff fleeces.
- **CAM:** Low tracking shot alongside Luka's slow walk to the pyre (35 mm, f/2).
- **ACTION (wordless):** Chase pulls off his beanie. Luke pushes his loupe headband off his head and holds it. Zane folds his microfibre cloth and puts it in his pocket — the only time in the demo he stops cleaning. Luka lays Faye on the pyre. Chase steps up and places the store's farewell card on her chest; the camera's focal plane catches it just long enough to read a few signatures among dozens (Conway, Pudmenzky, McRoberts, Dedman, and the rest of the store).
- **SOUND:** Strings only. Fire-pit crackle from the longhouse.

**3.4 — The call**
- **ACTION:** A cheerful, generic ringtone — horribly loud in the silence. It's coming from a cracked slate tablet propped on a fence post on a tiny tripod. Everyone looks at Chase.
- **LINES:**
  > **CHASE:** Sorry — sorry, that's — he said he'd call.
- **ACTION:** Chase taps it. Rue's face appears, frozen, macro-blocked, then catches up.
- **CAM:** Over Chase's shoulder, 50 mm: the slate sharp, the pyre soft behind it.
  > **RUE:** — can you hear me? Am I on? There's a little man with a line through him — ah. There you are. Luka. Chase. Lads.
  > **RUE:** For the record, I didn't make JARVIS.
  > **CHASE:** …Nobody said —
  > **RUE:** Force of habit. Every call I've ever been on starts with someone blaming me for JARVIS.
- **ACTION:** Chase turns the slate toward the pyre. Rue sees it. His face changes. **Name card: RUE · CEO (Currently on a Call).**
  > **RUE:** Ah. Ah, it's lovely. She'd hate it. *(beat)* It's lovely.
  > **LUKA:** Rue.
  > **RUE:** Head Office wouldn't let me come down. Said a CEO hasn't set foot in a store in thirty years, why start now. So I'm here the only way they allow. On a call. Which, as you know, I can't hang up.
  > **CHASE:** *(whispering to Luka)* Why can't he hang up?
  > **LUKA:** Nobody knows.
  > **RUE:** I can hear you, Chase.
- **ACTION:** Chase props the slate on the corner of the display table, facing everyone.

**3.5 — The eulogy**
This is where the story is told. The camera performs **one slow continuous drift** for the whole speech, letting Rue's words land on whoever they're about.

| Line | CAM |
|---|---|
| **RUE:** I've given a lot of speeches. Launches. Results. Apologies — mostly apologies. | On the slate, 50 mm. Begin a slow pull back. |
| **RUE:** This is the first one I've wanted to get right. | Pull back reveals the gathering around the pyre. |
| **RUE:** Faye ran Store Zero-Zero-One for longer than any of you have been alive. Well — longer than Chase has been employed, which in retail is the same thing. | Drift to Chase. He nearly laughs, catches it, looks down. **Plant:** the wind has flipped his lanyard badge. For ~2 s, in the focal plane, the *player* can read the back, in Faye's handwriting: **LO-FI**. Chase absently flips it back. |
| **RUE:** Everyone called her Wi-Faye. Because it didn't matter where you stood in that store — the stockroom, the counter, the car park, crying on your lunch break — you were connected to her. Full bars. | Drift to Luke, who wipes one eye with a blue glove and pretends it's snow. Zane, without looking, offers his cloth. Luke takes it. |
| **RUE:** You all know the world's gone strange. The Fimbul-Winter Sale's been "ending soon" for three years. Snow on the red cliffs. The bay frozen halfway to the islands. | Arc out past the mourners to the cliff edge, 24 mm: the frozen bay, the ice floes, the Mountain's blinking towers. |
| **RUE:** And Helpdesk… Helpdesk is on hold. The dead can't get through. They wander out there in the snow, waiting for a number that's never called. We call them the Churned. | Slow push toward the far shore. In the fog, very far away, a long line of still figures. Unclear. Wrong. |
| **RUE:** Through all of it, this little store stayed hidden. Head Office never found it. Not the Auditors. Not the ravens. That was Faye. | Pan along the copper wire of the ward ring; the runes glow; the hum is audible. |
| **RUE:** She built a ward around this place — Faraday, she called it — and nothing from above could hear a word we said. | Continue along the ring back toward the group. |
| **RUE:** She asked me for one thing, in the end. Her ashes, carried to the highest tower in all the Nine Bands, and scattered from the very top. Not by me. Not by Head Office. *(beat)* By you two. | Settle with the slate soft in the foreground, Luka sharp behind it. Chase looks at Luka. Luka looks at nobody. |
| **LUKA:** She said that. | Hold. |
| **RUE:** She said, "Luka will say no. Tell him I said yes." | **Rationed silence (3 s).** A very slow creep zoom on Luka, 50 → 60 mm. His jaw works. |

**3.6 — Lighting the pyre**
- **ACTION:** Luka holds out his hand without looking at anyone.
  > **CHASE:** I've got a lighter.
- **ACTION:** Chase produces a novelty lighter shaped like a flip phone. Flipping it open plays a tinny polyphonic jingle. Everyone stares.
  > **CHASE:** …It came with a case.
- **CAM:** 85 mm, f/1.8, close on Luka as he takes it. The corner of his mouth moves — the only almost-smile in the demo — then it's gone. He lights the kindling.
- **ACTION:** The fire takes. Orange light floods every face. Heat haze ripples the background. Embers spiral upward.
- **SOUND:** The four-note motif, full choir and low strings, swelling.

**3.7 — The World Cable**
- **CAM:** Cranes up with the smoke column (24 → 18 mm), above the longhouse roof and the pines. The whole bay spreads out below.
- **ACTION:** Far out, the ice splits along a line hundreds of metres long. **The World Cable** rises: a colossal segmented serpent of armoured cable, barnacled and kelp-hung, pulses of teal light racing down its length. Slabs of ice slide off its back. It lets out a long, low tone, like a dial tone sung by a whale.
- **LINES (voices carrying up from below):**
  > **CHASE (O.S.):** Is that — is that the World Cable?
  > **RUE (O.S.):** Undersea fibre. Older than the Bands, some say. Carries every word anyone's ever said across the water.
  > **LUKA (O.S.):** He doesn't surface.
  > **RUE (O.S.):** He liked her. Everyone did.
- **ACTION:** The Cable lowers its head in a slow bow, and sinks.

**3.8 — Zee at the treeline**
- **CAM:** Descends with drifting embers, but on the far side of the yard, settling into a **135 mm long-lens shot through pine branches** (foreground boughs heavy bokeh). Focus pulls through the branches to a tall hooded woman at the treeline, a huge wombat-shaped silhouette beside her.
- **ACTION:** **Name card: ZEE · ???** She lifts a finger to her lips. She is looking straight at Chase — who, the shot reveals, is soft in the background, staring back.
  > **CHASE:** Luka — there's someone in the —
- **CAM:** Whip pan (0.5 s, motion blur) to Luka turning, then back to the treeline. She's gone. Wombat-sized tracks, already filling with snow.
  > **LUKA:** There's no one.
  > **CHASE:** There was a woman. And a… very large wombat.
  > **LUKA:** Watch the fire.

**3.9 — Smoke wipe (time skip)**
- **CAM:** Rises into the smoke column. The frame fills grey-white for ~3 s, embers drifting through it in bokeh.
- **SOUND:** Music thins to one sustained note.
- **Behind the wipe:** dusk → night; the fire becomes embers; Luke and Zane leave (their cart lantern now bobbing far down the path); a faint teal-and-gold aurora appears in the north; Rue's slate dims to a grey tile with his initial — *Camera off*.
- **CAM:** Descends out of the smoke into the night yard.

**3.10 — The ashes** · **Checkpoint:** `pyre_embers`
- **CAM:** Low, 50 mm, f/2, focused on Luka's hands. Ember glow lights him from below.
- **ACTION:** Luka kneels at the embers with a clear plastic repair bag and gathers the ashes into it with his bare hands. He presses the tamper seal shut. The ticket, in Zane's neat handwriting, fills the frame for a moment:
  > REPAIR TICKET #0001 · CUSTOMER: FAYE · FAULT: ______ · RETURN TO: THE HIGHEST TOWER
- He puts the bag in his satchel.

**3.11 — The tune**
- **ACTION:** Chase sits on a chopping stump nearby, knees up, hands in his sleeves. Without thinking, he hums the four-note motif. Luka freezes mid-motion.
- **CAM:** Slow arc to a two-shot, Chase sharp, Luka soft, then a rack to Luka as he speaks.
  > **LUKA:** Where did you learn that.
  > **CHASE:** Faye. She hummed it whenever the system was down. *(beat)* So, always.
  > **LUKA:** *(quiet)* She hummed it at home too.
- *(Chase looks at him. It's the most Luka has ever said about himself.)*

**3.12 — The hand** *(see the DSL example in §5.7)*
  > **CHASE:** I don't think I'm ready for this, Luka. I'm a casual. I do Saturdays.
- **ACTION:** Luka's hand rises toward Chase's shoulder. Focus pulls to the hand. It hovers. It withdraws and closes into a fist. Chase, looking at the embers, never sees it.
  > **LUKA:** Get some sleep. We leave at first light.
  > **CHASE:** Okay.
- **ACTION:** Chase stands and heads for the longhouse door. The camera holds on Luka's fist, then rises to his face, lit by embers.

---

### BEAT 4 — *The Ward Falls*

**Location:** longhouse yard, night · **Mode:** cinematic → **combat tutorial** · **Checkpoint:** `ward_falls`

**4.1 — The ward dies**
- **SOUND:** The ward's hum falters into a descending electrical whine.
- **CAM:** Turns sharply to the nearest rune post (35 mm). Its rune stutters like a failing fluorescent tube and goes dark. Then the camera **spins** with the failure as it races around the ring — runes going out one after another — a 270° pan in 3 s with motion blur.

**4.2 — Rue is cut off**
- **ACTION:** Rue's slate flares back to life in a burst of static.
  > **RUE:** Lads — LADS. The ward. The ward was hers, it's going with her — Head Office can see the smoke — they can see y—
- **ACTION:** Rue freezes mid-word, macro-blocked. A flat system chime. On screen: **Call ended by host.**
  > **CHASE:** *(at the door, turning back)* Did he just hang up?
  > **LUKA:** He can't hang up.
  > **CHASE:** So someone hung up on him.
- **ACTION:** Chase grabs the slate and pockets it. "In case he calls back." *(Plant: Rue's return.)*

**4.3 — The Mystery Shopper**
- **CAM:** Tilts up to the longhouse gable. A raven, one green glowing eye, clipboard. It scribbles. It caws. *(Mystery Shopper #1 — collectable from now on.)*

**4.4 — The Churned rise**
- **ACTION:** Beyond the dead ward ring, the snowdrifts move. Hands. Frost-crusted heads. Eyes glowing a sick teal.
- **SOUND:** A low chorus of muttering from under the snow: *"…cancel… my…" "…speak to the… manager…" "…I've been… on hold…"*

**4.5 — The Cold Call**
- **ACTION:** Luka walks to the pyre's remains. Standing upright in the scorched display-table frame is a frost axe, its head still rimed with ice despite the fire. Luke and Zane laid it with her. Luka pulls it free. Frost crackles along the blade; the rounded window cut through its head glows teal; a retail price tag swings from the pommel.
- **SOUND:** A single low choir hit. The axe rings with a faint rising tone, like a phone about to ring.
  > **LUKA:** Casual. Behind me.
  > **CHASE:** *(drawing the Treble Bow)* I've been practising.
  > **LUKA:** On what.
  > **CHASE:** …Bins.
- **CAM:** **Soft handoff** into combat framing. HUD fades in. Combat music enters on the downbeat.

**4.6 — Combat tutorial** *(numbers and AI in §7)*

Prompts are small runestone keycaps that fade after the action is performed twice. Teaching is mostly through Chase.

| Wave | Enemies | Teaches | Chase |
|---|---|---|---|
| **1** | 3 Churned | Light, Heavy, Dodge (first enemy telegraph triggers 0.5× slow-mo for 0.4 s, once only), **Close the Deal** finisher on the first stunned enemy | "Left side!" · "Is it weird that the dead customers still want to speak to the manager?" |
| **2** | 2 Churned + 1 Hold-Music Churned | **Aim + Throw** to freeze ("On Hold"), **Callback** to recall, fighting unarmed while the axe is out | "Why is that one humming — why is it HUMMING —" · on freeze: "Your call is important to us." |
| **3** | 1 Churned Brute (queue-stanchion shield and spear) + 2 Churned | **Shield**, **Price Match** parry, red = unblockable, **Command Chase** to break the guard | "He's got a stanchion!" · "I'll get his attention — sort of!" |

**4.7 — After**
> **CHASE:** *(breathing hard)* That was — I hit one! I hit — I hit something.
*(From somewhere in the woods: a deep, deeply offended animal bellow.)*
> **CHASE:** …What was that.
> **LUKA:** Something you hit.
> **LUKA:** We go now. Before more come.

- **ACTION:** Luka checks the satchel. They leave the yard by the path; the Mystery Shopper on the gable is still there for players who look up.

---

### BEAT 5 — *The Kiosk* *(Stretch)*

**Location:** a hollow giant stump beside the path · **Mode:** cinematic → upgrade menu → explore

**5.1 — Arrival**
- **ACTION:** Luke and Zane's cart is parked inside a vast hollow stump, under a canvas awning. A forge glows in an old steel cabinet; its bellows are a laptop cooling fan the size of a cartwheel. Hand-painted sign: **LUKE & ZANE — SCREENS, SEALS & SMITHING.** Under it in Zane's writing: *PLEASE SANITISE.* Under that in Luke's: *OR DON'T.*
  > **LUKE:** Oi! Survivors! Told you the ward'd go.
  > **ZANE:** You said the ward would "hold for a hundred years".
  > **LUKE:** I said it'd hold for a hundred years if NOBODY touched it.
  > **ZANE:** Someone died, Luke.
  > **LUKE:** *(beat)* …Yeah. Yeah, alright. *(to Luka)* Sorry.

**5.2 — Faye's axe**
- **CAM:** Luke notices the Cold Call. The camera moves in slowly on his face (50 mm). It's his unfunny moment.
  > **LUKE:** That's — that's Faye's.
  > **ZANE:** We forged that for her. Twelve years ago. Not for you. *(beat)* No offence.
  > **LUKA:** She left it to me.
  > **LUKE:** *(looking away, gruff)* …Course she did. *(holds out his hand)* Gimme. It's been through a funeral and a fight. Needs a tune.

**5.3 — Upgrades**
- **CAM:** Drifts behind the bench (50 mm). The menu appears as a carved slate panel lying on the bench, lit by the forge.
- **Tutorial:** spend SIMsilver on Cold Call level 2; Luke etches the Runic Promo **Glacial Rebate** into the axe head. (Full list in §8.)
- **Zane's moment:** Zane sees the satchel.
  > **ZANE:** The ticket — I left "Fault" blank. I didn't know what to put.
  > **LUKA:** Leave it blank.

**5.4 — Leaving**
- **ACTION:** Luke licks a screen protector before pressing it onto the Tempered Guardian. Zane gags.
  > **LUKE:** Oi, Casual. Your bow's held together with tape.
  > **CHASE:** It's gaffer. It's structural.
  > **ZANE:** It's unhygienic.
- **Easter egg:** On a shelf behind the cart is a cassette: **PUDDING — DEMO TAPE**. Interact: *"Oh no. Oh no, they kept that."* — Chase gave it to Faye; she kept it. Collecting it changes the end-credits music.
- **Repeatable:** interact with the smiths to ask "Brothers?" again for escalating denials (trophy after three).

---

### BEAT 6 — *The Wombat* *(Core)*

**Location:** Zee's clearing — a frozen creek, birches, low mist · **Mode:** cinematic · **Checkpoint:** `zee`

**6.1 — The trail**
- **ACTION:** Gouges in the snow, a trail leading off the path. Chase stops.
  > **CHASE:** Luka. Look.
- **ACTION:** **Hildis-Vinnie** — a giant wombat the size of a small car — lies on her side in the snow, whimpering. One of Chase's arrows, with its gaffer-taped fletching, is stuck in her rump.
  > **CHASE:** That's… that's my arrow.
  > **LUKA:** Leave it.
  > **CHASE:** It's hurt. I hurt it.

**6.2 — Zee**
- **CAM:** Tracks Chase as he approaches (35 mm), Luka soft behind.
  > **ZEE (O.S.):** Gently.
- **CAM:** She rises from behind the wombat; focus racks from Chase to her.
  > **ZEE:** He's not dangerous. He's just very big, and very offended.
  > **CHASE:** I'm so sorry. I was aiming at a — there was a — it was a dead customer.
  > **ZEE:** I know. I saw. You did well.
- **ACTION:** She draws the arrow out. The wombat grunts. She hands the arrow back to Chase.
  > **ZEE:** Keep this. You'll need every one of them.
- **ACTION:** She lays a palm on the wombat's broad forehead.
  > **ZEE:** Let's try a gentle reset.
- **ACTION:** A soft three-note chime; spirals of rune-light; the wound closes. Hildis-Vinnie heaves upright, shakes off the snow, and sneezes directly onto Luka.

**6.3 — The conversation**
- **CAM:** Slow orbit favouring whoever speaks.
  > **LUKA:** *(wiping snow from his face)* Who are you.
  > **ZEE:** Zee. I live in the woods. Mostly. *(her eyes go to the satchel)* You're carrying her.
  > **LUKA:** *(hand to the satchel)* That's not your concern.
  > **ZEE:** No. It's yours. *(softly)* I'm sorry, 2IC. She was the best of us.
  > **CHASE:** You knew Faye?
  > **ZEE:** Everyone who ever trained anyone knew Faye. *(to Luka)* The old Hornibrook is ahead. Something lives under it that was never taught manners.
  > **LUKA:** We don't need help.
  > **ZEE:** Nobody does. Until the queue gets long.
- **ACTION:** She presses a charm into Chase's hand: an old pager on a braided lanyard cord.
  > **ZEE:** Hold Pattern. When everything gets too fast, it'll slow down for you.

**6.4 — The warning**
- **CAM:** As she turns to go, she steps close to Luka. A tight two-shot, 85 mm, f/1.8: Zee sharp, Luka soft over her shoulder, Chase far back fussing with the charm.
  > **ZEE:** And 2IC — if someone comes to your door… *(beat)* Don't tell him no. He won't hear it.
  > **LUKA:** What does that mean?
  > **ZEE:** *(already walking into the mist, the wombat following)* It means say something else.
- **ACTION:** **Name card updates: ZEE · The Witch of the Woods.**
  > **CHASE:** She was nice.
  > **LUKA:** She was hiding something.
  > **CHASE:** Everyone's hiding something. You're hiding like eight things.
  > **LUKA:** …Walk.
- **Handoff.** Talisman unlocked: **Hold Pattern** (§7.9).

---

### BEAT 7 — *The Cliff Path* *(Stretch; Core uses a short direct path)*

**Location:** the path along the red cliffs to the Hornibrook · **Mode:** exploration

**7.1 — Walk-and-talk (path segment A)**
> **CHASE:** Luke said something. When you weren't listening. He called you "the Ghost".
> **LUKA:** Luke says a lot.
> **CHASE:** Ghost of what?
> **LUKA:** …Walk faster.

**7.2 — Walk-and-talk (path segment B)**
> **CHASE:** Do you think Rue's okay?
> **LUKA:** He's the CEO.
> **CHASE:** That's not a yes.
> **LUKA:** It's not a no.
> **CHASE:** *(beat)* That's the nicest thing you've ever said about him.

**7.3 — Along the path:** the chime-phone puzzle, the JARVIS cairn, the wreck from another time, the singing stone of three brothers, the frozen jetty detour, the Mystery Shoppers, Stockroom Cages and more. All catalogued in **§9.4**.

---

### BEAT 8 — *The Queue* *(Stretch)*

**Location:** the Hornibrook bridgehead · **Mode:** combat · **Checkpoint:** `queue`

**8.1 — The queue**
- **CAM:** 24 mm, low, then a slow crane up along the line.
- **ACTION:** The path opens onto the old bridge stretching out over the frozen bay: broken concrete spans, rebar like ribs. At the bridgehead, a ruined toll booth with a ticket machine glowing: **NOW SERVING 001**. Between rows of rusted queue stanchions, a long silent line of Churned stands motionless, facing the bridge, snow piled on their shoulders. Dozens. Heads bowed. Waiting.
- **SOUND:** Music drops out. Wind only. The faint tick of the ticket machine.
  > **CHASE:** *(whisper)* They're… queuing.
  > **LUKA:** *(whisper)* Don't touch anything.
- **ACTION:** Chase has already taken a ticket. The machine dings, bright and loud.
  > **CHASE:** *(reading it)* Four thousand, eight hundred and seventeen.
- **ACTION:** Every head in the queue turns at once.
  > **LUKA:** Casual.
  > **CHASE:** I know.

**8.2 — The fight**
- Queue Churned peel off in groups of 2–3; two **1-Star Reviewers** throw burning stars from the toll-booth roof; a Hold-Music Churned arrives mid-fight; a Brute closes it out.
- **Tutorial:** End-of-Month Rage is pre-filled for this fight with the prompt **Rage ready**. If Glacial Rebate was etched at the kiosk, its prompt appears here too.

**8.3 — After**
- **ACTION:** The ticket machine clicks over: **NOW SERVING 002**.
  > **CHASE:** …Progress.

---

### BEAT 9 — *Dodgy Hamarr*

**Location:** on and under the Hornibrook · **Mode:** boss · **Checkpoint:** `hamarr`

**9.1 — The toll**
- **ACTION:** The bridge shakes. A huge hand grips the edge of the deck from below. **Dodgy Hamarr** hauls himself up: six metres tall, grey-blue hide crusted with ice and moss, teal runes carved into his skin that read, if you look closely, as ALL-CAPS comments. A beard of tangled old phone cables. In one fist, the **Totem of Grievances**: a whole tree trunk carved with stacked, furious faces, their eyes glowing teal.
- **CAM:** 18 mm, low. The operator stumbles backward as he lands (trauma 0.4), recovers, re-frames up at him.
  > **HAMARR:** TOLL.
  > **CHASE:** Did he just say toll?
  > **HAMARR:** TOLL. OR. REVIEW.
  > **LUKA:** Neither.
  > **HAMARR:** *(raising the totem)* WORST. SERVICE. EVER.
- **UI:** Boss title, etched: **DODGY HAMARR · Troll of the Comment Section**. Boss health bar fades in at the top.
- **CAM:** Handoff to boss framing.

**9.2 — Story moments inside the fight** *(attack design in §7.12)*

- **At 70% — Chase runs ahead.**
  > **CHASE:** I've got this! I've got this!
  - Hamarr's **Reply** grab catches Chase and lifts him. Prompt: **Hit the hand!** (throw or melee the glowing hand within 6 s; on failure, Hamarr drops Chase anyway and Luka takes damage). Chase falls and rolls clear.
  > **LUKA:** STAY BACK.
  > **CHASE:** *(shaken)* Okay. Okay.

- **At 35% — "Good."** A short scripted in-fight sequence, still in one take. Hamarr backhands Luka into a pillar — the camera tracks the flight and the impact. Hamarr raises the totem to finish him. Chase's arrow hits the glowing top face of the totem; it bursts in teal sparks; Hamarr reels.
  > **LUKA:** *(getting up)* …Good.
  > **CHASE:** *(beat)* Did you just say "good"?
  > **LUKA:** Shoot.
  - This is the only time Luka says "Good" in the demo. Do not use it as a bark anywhere else.

**9.3 — Close the Deal** *(at 0% health, when stunned)*
- **Prompt:** **Close the Deal**.
- **CAM:** Fully handheld (intensity 0.8), 24 mm, running alongside Luka.
- **ACTION:** Hamarr drops to one knee. Luka runs up his forearm, wrenches the totem out of his grip, swings it in a full circle (the camera ducks under it), and smashes it into his jaw. Time slows to 0.25× at impact; DOF drops to f/1.4; ice shards and broken teeth hang in the air as bokeh. Real time returns. Hamarr topples backwards off the deck onto the ice below, which cracks but holds.
- *(Silence. Then, from below, very small, in lowercase subtitles:)*
  > **HAMARR:** …ok. fair enough.
- *(He goes still.)*

---

### BEAT 10 — *Not Ready*

**Location:** bridge → shortcut → longhouse gate · **Mode:** walk-and-talk · **Checkpoint:** `walk_home`

**10.1 — The argument**
- **CAM:** 35 mm walking two-shot; arcs to favour each speaker.
  > **CHASE:** *(breathless, elated)* We did it — did you see — I hit the — right in the —
  > **LUKA:** You ran ahead.
  > **CHASE:** I helped!
  > **LUKA:** You helped a troll nearly kill you.
  > **CHASE:** And then I helped you not die! That's one-for-one, that's a —
  > **LUKA:** That's not how it works.
- *(Chase looks down at the troll lying on the ice.)*
  > **CHASE:** He was just angry, Luka. Under all of it. He was just someone who was really, really angry.
  > **LUKA:** Angry things still kill you.
  > **CHASE:** Is that how you see the customers?
  > **LUKA:** *(2 s)* No.
  > **CHASE:** Is that how you see me?
- *(Luka doesn't answer. He walks. Chase, quietly:)*
  > **CHASE:** In sales, silence is a yes.
  > **LUKA:** *(without turning)* We're not in sales.
  > **CHASE:** We're literally always in sales.
  > **LUKA:** We go home. One night. You're not ready.
  > **CHASE:** I just helped you kill a troll.
  > **LUKA:** Home.

**10.2 — The shortcut and the cloak wipe**
- **ACTION:** Luka kicks a ladder down from the tollhouse roof to the cliff path above (**Shortcut opened**, a soft chime). As he climbs, the camera follows tight behind his cloak — **cloak wipe** — and on the other side they're walking through the longhouse gate. Snow heavier. The aurora brighter.

---

### BEAT 11 — *The Knock*

**Location:** inside Store 001, night · **Mode:** cinematic → end card · **Checkpoint:** `knock`

**11.1 — The blank plaque**
- **ACTION:** Inside the longhouse: low firelight, a carved timber sales counter, driftwood display tables holding carved wooden phones, an empty chair with Faye's lanyard over its back. The **Best of the Month** wall: thirty-six plaques, each with Faye's carved likeness and a month, and one blank.
  > **CHASE:** *(heading for the stove)* Tea?
  > **LUKA:** No.
  > **CHASE:** I'm making tea.
- **CAM:** 50 mm, f/2, a slow push as Luka stands in front of the blank plaque and touches it.
- **SOUND:** No music. Fire only.
  > **LUKA:** *(very quiet, to the plaque)* I said no to this job three times. *(beat)* I was not supposed to be the one who stayed.

**11.2 — Knock, knock, knock**
- **SOUND:** Three heavy, cheerful knocks.
- **CAM:** A sharp turn to the door and straight back to Luka.
  > **LUKA:** *(low, urgent)* Casual. Under the floor.
  > **CHASE:** What? Why —
  > **LUKA:** Under. The. Floor.
- **ACTION:** Chase lifts the trapdoor behind the counter and drops down.
- **CAM:** **Follows him down** into the crawlspace: dust in slatted light, and — passing through frame — a heavy locker wrapped in chains, a faint red glow leaking from its seams, **COMMISSION** scratched into the lid. Chase doesn't notice it. He presses his eye to a gap between the floorboards. The camera rises back up *through the gap* to Luka at the door.

**11.3 — The Stranger**
- **ACTION:** Luka opens the door. Snow blows in. On the step: **Jarrad**. Smiling. Snow on his shoulders, sleeves rolled up, a volleyball under one arm. **Name card: JARRAD · Here to Help!**
  > **JARRAD:** G'day! Lovely place. Bit hard to find, mind you — normally there's a weird hum round here. *(bright)* Is this the 2IC?
  > **LUKA:** No.
  > **JARRAD:** *(not a flicker — as if Luka said nothing at all)* Great! So it is.
- *(Luka's eyes narrow.)*
  > **JARRAD:** Look, I'll keep it quick, I know you're busy. *(spins the volleyball on one finger)* I'd like to speak to the manager.
  > **LUKA:** …The manager is dead.
  > **JARRAD:** *(warmly)* Then I'll speak to you.
- **ACTION:** The volleyball stops spinning.

**11.4 — The pull-out**
- **CAM:** Holds a two-shot for 3 s (the last rationed silence). Then begins one long pull back: down through the floor gap to Chase's eye in the dark, breath held; past the chained locker's red glow; out through a gap in the foundation stones into the snowy night; rising and rising — the longhouse small and warm, the aurora overhead, the bay, the Mountain. The falling snow gathers into the title letters: **GOD OF WARRANTY**.
- **SOUND:** A single low string. Then the four-note motif, once, on solo cello.

**11.5 — End card**
- *Thanks for playing the God of Warranty demo.*
- **Stats:** Time · Calls Dropped (deaths) · Mystery Shoppers x/5 · Easter eggs x/18 · SIMsilver earned · Price Matches · Finishers · Trophies.
- **Buttons:** **Play Again** · **Back to Optus Games** (links to the hub).
- **Credits** roll over a lo-fi arrangement of the four-note motif — or Chase's *Pudding — Demo Tape* track if the cassette was found. The parody / fair-dealing disclaimer sits at the end of the credits.
- **Post-credits stinger (Polish tier):** A vast white desk above the clouds. A raven lands on it. A large hand takes its clipboard: **STORE 001 — LOCATED.** The hand stamps it. Black.

---

## 7. Combat Design

### 7.1 Feel Targets

Combat should feel close, heavy and physical — a big man with an axe in tight spaces, with a kid covering him.

| Lever | Values |
|---|---|
| **Hitstop** (attacker + victim freeze) | Light 50 ms · Heavy 90 ms · Charged 120 ms · Throw impact 40 ms · Price Match 140 ms · Finisher 120–200 ms |
| **Camera trauma** (0–1, squared) | Light 0.08 · Heavy 0.18 · Charged 0.3 · Luka hit 0.25 · Boss slam 0.5 (falls off with distance) |
| **Rumble** (Gamepad `vibrationActuator`, if available) | Light 60 ms weak · Heavy 110 ms strong · Catch 40 ms sharp · Boss slam 250 ms both motors |
| **Enemy reactions** | Flinch (light) · Stagger (heavy) · Knockback · Knockdown · Launch · Frozen |
| **Impact VFX** | One-frame additive flash at contact · frost shards · teal-black ichor · snow puff on knockdown |
| **Impact SFX** | Four layers: whoosh, impact body, material (frost/flesh/wood), enemy voice. Pitch ±6% random |
| **Input buffer** | 10 frames |
| **Cancels** | Dodge or Shield can cancel recovery from 4 frames after active frames end. Committed, not floaty. |

### 7.2 Controls

| Action | Keyboard & Mouse | Gamepad | Touch |
|---|---|---|---|
| Move | WASD | Left stick | Left virtual stick |
| Camera | Mouse | Right stick | Drag on right half |
| Light attack | LMB | R1 / RB | **Light** |
| Heavy attack (hold to charge) | E | R2 / RT | **Heavy** (hold) |
| Aim | Hold RMB | Hold L2 / LT | **Throw** (hold to aim, drag to adjust) |
| Throw Cold Call | LMB while aiming | R1 while aiming | Release **Throw** |
| Callback (recall) | R | Triangle / Y | **Throw** button becomes **Callback** |
| Shield (hold) / Price Match (tap on hit) | Q | L1 / LB | **Shield** |
| Dodge / Roll (double tap) | Space | Cross / A | **Dodge** |
| Sprint (toggle) | Left Shift | L3 | Push stick to edge |
| Command Chase | F | Square / X | **Chase** |
| Close the Deal (when prompted) | V | R3 | Contextual button |
| End-of-Month Rage | Z | L3 + R3 | **Rage** (appears when full) |
| Runic Promo — light / heavy | Q + LMB / Q + E (or 1 / 2) | L1 + R1 / L1 + R2 | Two small runic buttons |
| Quick turn 180° | C | D-pad down | Double-tap camera area |
| Interact | E (contextual, out of combat) | R1 (contextual) | Contextual button |
| Lock-on (optional) | Tab | R3 click-and-hold | — |
| Pause ("On Break") | Esc | Options / Menu | Pause icon |

All bindings remap. Hold-vs-toggle options for Aim and Shield.

### 7.3 Luka's Moveset (60 fps frame data, *Give Me a Plan* difficulty)

| Move | Startup | Active | Recovery | Damage | Stun | Notes |
|---|---|---|---|---|---|---|
| Light 1 | 8 | 4 | 14 | 10 | 6 | Diagonal chop |
| Light 2 | 7 | 4 | 14 | 10 | 6 | Backhand |
| Light 3 | 9 | 5 | 16 | 12 | 8 | Rising cut |
| Light 4 | 14 | 6 | 24 | 20 | 14 | Overhead, 2 m knockback |
| Heavy 1 | 18 | 6 | 24 | 25 | 15 | Wide horizontal |
| Heavy 2 (charge up to 36 f) | 26 | 8 | 30 | 40 / 60 charged | 25 | Launches light enemies |
| **Upsell** (L, L, H) | 16 | 8 | 28 | 30 | 20 | 270° sweep — *KPI Tree unlock* |
| Shoulder Barge (sprint + Light) | 6 | 10 | 22 | 15 | 20 | Knockdown |
| Fists — Light | 6 | 3 | 10 | 4 | 14 | While the axe is out |
| Fists — Heavy | 12 | 4 | 18 | 8 | 25 | While the axe is out |
| Shield Bash (Shield + Light) | 10 | 4 | 18 | 6 | 18 | Breaks enemy guards |
| Dodge | — | i-frames 4–14 | 20 total | — | — | Short sidestep |
| Roll | — | i-frames 3–16 | 26 total | — | — | Double tap |

### 7.4 The Cold Call

Faye's frost axe, forged by Luke and Zane. Dark steel head with a rounded window cut through it (glows teal), frost-blue runes, teal grip tape, and a retail price tag still swinging from the pommel. Fine print is engraved down the entire haft (readable in the pause menu inspect view):

> *\*Terms and conditions apply. Axe must be returned in original condition. Cold calls may be recorded for training and quality purposes.*

| Mechanic | Spec |
|---|---|
| **Throw** | 10 f wind-up. Flies at 45 m/s, max 40 m. 18 damage + 50 frost. Soft aim assist toward enemies within 4° (8° on gamepad/touch). Whistles a rising tone, like a phone about to ring. |
| **On Hold (freeze)** | Frost builds to 100 → enemy frozen in a crust of ice for 3 s. A frozen enemy plays a faint, tinny hold-music loop from its body (3D audio). Hitting a frozen enemy shatters the ice for +50% damage. |
| **Wall Mount** | A light enemy within 1.5 m of a wall when hit is pinned to it, struggling, until the Callback. *(KPI Tree unlock.)* |
| **Callback** | 6 f to start. Returns at 55 m/s on a slight curve; hits anything in its path for 12 damage + stagger. Sound: a two-tone notification chime as it leaves. |
| **The catch** | Always caught, with a heavy *thunk* and a tiny camera kick. A light attack within 10 frames of the catch deals +50% (the **Callback Combo**). |
| **Unarmed** | While the axe is out, Luka fights with fists: weaker damage, much faster stun. |
| **World use** | Rings wind-chime phones, breaks Stockroom Cage padlocks, knocks down Mystery Shoppers, cuts hanging ropes. |

### 7.5 The Tempered Guardian and the Price Match

A round shield that snaps open from Luka's left bracer like a fan, its face a sheet of tempered "screen protector" glass in a steel rim. Heavy hits craze the glass; it self-heals over 2 s.

- **Block:** hold Shield. Blocks all white-indicator attacks from the front. Chip damage 20%.
- **Price Match (parry):** press Shield within the first 9 frames (150 ms) before a hit lands. Bright glint, a struck chord, 140 ms hitstop, enemy staggered for 1.2 s, +30 stun. On-screen: a small **PRICE MATCHED** stamp at the hit point that fades fast.
- **Red-indicator attacks are unblockable** — dodge them.
- **Shield Bash:** breaks Brute guards.

### 7.6 Stun and *Close the Deal*

Every enemy has a stun bar (yellow, under the health bar). Fists build it fastest. When it fills, a **Close the Deal** prompt appears over the enemy for 3 s. Each finisher is a short in-take execution with its own camera move, drops a health pickup, and fills a little Rage.

Gore setting: **Full** (dismemberment, ichor) or **Reduced** (impacts only). The Churned bleed teal-black ichor, not red.

| Finisher | Target | What happens |
|---|---|---|
| **Early Termination Fee** | Churned | Luka grabs it by the collar, headbutts it, then splits it with a rising axe cut. |
| **Port Out** | Churned (axe in hand) | Kicks it into the air, throws the Cold Call through it at the apex, catches the Callback one-handed. |
| **Cooling-Off Period** | Churned (unarmed) | Slams its head into the snow and stomps; the ice shatters. |
| **Contract Signed** | Brute | Rips away its stanchion spear and drives it through the Brute into the ground. The retractable queue belt snaps back across its face. |
| **Please Hold** | Hold-Music Churned | Hurls it into the nearest group, where it detonates. |
| **One Star** | 1-Star Reviewer | Catches its burning star mid-air, jams it back into its face, kicks it away. |

**Pickups:** **Signal Stones** (teal-green crystals shaped like signal bars) restore health. **Target Stones** (yellow) add Rage.

### 7.7 Chase — Support Kit

| Behaviour | Spec |
|---|---|
| **Following** | Stays 3–6 m behind or beside Luka. Avoids the 2 m cone in front of Luka during attacks. Climbs, vaults and squeezes with him. |
| **Auto-fire** | With no command, fires a Note Arrow every 3–5 s at whatever Luka is engaging (3 damage, 6 stun). |
| **Command (F / Square)** | Fires an aimed Note Arrow at the reticle target, or at the nearest enemy in Luka's facing. 6 damage, 12 stun, and a **distract**: the enemy turns toward Chase for 1.5 s, exposing its back. |
| **Quiver** | 4 arrows (5 with Fresh Strings), regenerating one every 1.6 s. Shown as note icons on the HUD. |
| **Faye's Chord** | Commanded arrows that hit within 3 s of each other play the next note of Faye's four-note motif. The **fourth note** releases a **Chord**: a shockwave around the target (40 stun to everything within 3 m). A miss resets the sequence. *(KPI Tree unlock.)* |
| **Grapple** | Commanding Chase while an enemy's stun is ≥70% makes him leap onto its back and choke it with the bow string for 3 s ("HOLD STILL, SIR!"). *(KPI Tree unlock.)* |
| **Can't die** | Big hits knock him down for 3 s ("Ow — I'm fine — I'm fine"). |
| **Warnings** | Calls out off-screen threats in sync with the indicators (§7.10). |

The **Treble Bow** ringing pitch rises with each consecutive hit — so even without the Chord unlock, a good sequence of shots *sounds* like the start of Faye's tune.

### 7.8 Runic Promos

Equip one light and one heavy. Cooldown-based.

| Promo | Slot | Effect | Cooldown | Source |
|---|---|---|---|---|
| **Glacial Rebate** | Light | Luka slams the axe into the ground; ice spikes erupt in a 5 m ring. 30 damage + 70 frost. | 25 s | Etched by Luke at the kiosk |
| **Conference Call** | Heavy | An empowered throw that ricochets between up to 5 enemies within 8 m of one another. 20 damage + 40 frost per bounce, then returns on its own. | 40 s | Stockroom Cage on the cliff path |

### 7.9 End-of-Month Rage and the Hold Pattern Talisman

**End-of-Month Rage.** The meter fills from dealing damage (+1 per 10), taking damage (+1 per 5) and Target Stones. When full, activate it: Luka sheathes the axe and roars **"TARGET."** The grade shifts to a deep red-gold, a heavy drum layer joins the music, and for 12 s:

- Unarmed hits deal ×2.5 damage and heal 2 HP each.
- Luka can't be staggered.
- Heavy becomes **Quota Slam**, a ground-pound shockwave.
- It ends with a final **Month Close** slam.

**Hold Pattern (talisman, from Zee).** A perfect dodge — inside the last 6 frames before a hit lands — triggers 1.2 s of 0.5× world time (Luka at full speed), with the world's audio muffled as if on hold. 20 s cooldown.

### 7.10 Threat Indicators and Attack Tokens

- **Indicators:** chevrons on the screen edge point to off-screen enemies that are about to attack. **White** = melee, **teal** = ranged projectile, **red** = unblockable. Each also differs in shape (single chevron, dot, double chevron) for colour-blind players.
- **Attack tokens:** only a limited number of enemies may attack at once (2 melee + 1 ranged on *Give Me a Plan*). Enemies without a token circle at 4–6 m, feint, reposition and taunt. Off-screen enemies get +0.3 s wind-up for fairness.

### 7.11 Enemies

| Enemy | HP | Attacks | Behaviour | Look |
|---|---|---|---|---|
| **Churned** | 60 | Swipe 12 (0.55 s tell) · Lunge 15 (0.8 s) | Shambling advance, flinches on every hit, mutters complaints. Stun cap 50. | Grey frost-bitten ex-customers in torn puffer jackets and old polos, glowing teal eyes, one still clutching a cracked phone. |
| **Churned Brute** | 160 | Jab 14 (0.6 s) · Sweep 18 (0.9 s) · Red overhead 28 (1.1 s, unblockable) | Frontal guard behind a **PLEASE QUEUE HERE** sandwich-board shield, wielding a rusted queue stanchion as a spear. Guard breaks to Shield Bash, charged Heavy, Chase's distract, or a throw at the legs. | Big, slow, a queue belt trailing from the stanchion. |
| **Hold-Music Churned** | 40 | Self-destruct 30, 3.5 m radius, knockdown | Bloated, yellow light leaking from its seams, a tinny muzak loop playing inside it that grows louder as it approaches. At 5 m it begins a 2.5 s *"Please… hold…"* swell, then detonates. Frozen → can't explode, and shattering it makes a harmless dial-tone pop. Killed before the swell ends → small 2 m blast that damages other enemies too. | Swollen silhouette, distorting sound rings visible around it. |
| **1-Star Reviewer** | 45 | Burning star 10 (arcing, 14 m/s, leaves a 2 s fire patch) | Keeps 10–16 m away, usually on high ground. Throws every 3 s. Hops away if Luka gets within 5 m. Dies to one freeze-and-shatter. Mutters *"one… star…"*, *"would not… recommend…"* | Gaunt, hunched, in a cardigan. |

AI states for all: **Idle/Queue → Alert → Approach → Circle (no token) → Attack (token) → Recover → Hit react → Dead**. Churned deaths collapse with a simple verlet ragdoll.

### 7.12 Boss — Dodgy Hamarr, Troll of the Comment Section

**Arena:** the Hornibrook deck — roughly 40 × 18 m of broken concrete, four standing pillars (charge targets), the ruined toll booth, rubble walls at the broken edges so nobody falls off by accident.

**Stats (*Give Me a Plan*):** 2,000 HP, stun bar. Six metres tall. Speaks only in ALL CAPS subtitles.

| Attack | Tell | Timing | Damage | Counter |
|---|---|---|---|---|
| **Totem Slam** | Totem raised overhead, red glint | 1.0 s | 35 + 4 m shockwave | Unblockable — dodge sideways |
| **Comment Sweep** | Totem drawn back low | 0.8 s | 25 | Block, roll, or **Price Match** (1.5 s stagger) |
| **Stomp** | Foot lifted | 0.6 s | 15 + knockdown within 3 m | Dodge back |
| **Reply** (grab) | Hand reaches, glowing yellow | 0.7 s | 20 + hold | Dodge; if caught, mash Light to break free or have Chase shoot the hand |
| **Charge** | Head down, paws the snow | 1.2 s | 30 | Dodge sideways. If he hits a pillar, he's **stunned for 3 s** — big punish window |
| **Totem Plant** (once, at 50%) | Slams totem upright into the deck | — | 12 per pulse, 6 m, every 4 s | Summons 2 Churned. Chase shoots the glowing top face (3 hits), or Luka hits the totem 6 times — it topples and Hamarr staggers for 4 s fetching it |
| **Comment Storm** (phase 3) | Roar, "CAPS LOCK" | 8 s | 10 per shard | Glowing speech-bubble shards rain on red ground decals (1.2 s warning each). Keep moving |

**Phases**

| Phase | Health | Moveset | Story beat |
|---|---|---|---|
| 1 | 100–60% | Slam, Sweep, Stomp, Charge | At 70%: Chase runs ahead and is grabbed (§6, Beat 9.2) |
| 2 | 60–30% | + Reply, Totem Plant at 50% | At 35%: the "Good." sequence |
| 3 | 30–0% | + Comment Storm; everything 1.2× faster | At 0%: **Close the Deal** finale |

**Mid-fight stun:** in phases 1–2, filling his stun bar opens a short Close the Deal that deals 150 damage (Luka leaps up and buries the axe in his shoulder) but doesn't kill.

**Hamarr's ALL-CAPS barks:** "FIRST!!" · "RATIO." · "DO YOUR JOB." · "I WAS ON HOLD FOR THREE HOURS." · "WHO HIRED THIS GUY." · "ONE STAR." · "EDIT: STILL ANGRY." · "TOLL." · on a big hit: "OK BUT—"

### 7.13 Difficulty

| Mode | Enemy damage | Enemy HP | Price Match window | Melee tokens |
|---|---|---|---|---|
| **Give Me a Story** | 0.5× | 0.7× | 220 ms | 1 |
| **Give Me a Plan** *(default)* | 1.0× | 1.0× | 150 ms | 2 |
| **Give Me a Contract** | 1.4× | 1.25× | 110 ms | 3, more aggressive |
| **Give Me God of Warranty** | 2.0× | 1.5× | 83 ms | 3, enemies gain perks (Churned lunge twice, Brutes counter-bash) |

### 7.14 Death — *Call Dropped*

The world slows to 0.2×, desaturates, and the audio low-passes into a muffled busy tone. Big carved serif: **CALL DROPPED**. Underneath: *Luka has been disconnected.* Options: **Call Back** (restart at the last checkpoint) or **Change Plan** (difficulty). *Call Back* fades up from black — the only fade in the demo.

### 7.15 HUD

Minimal, like the source. Everything fades out in cinematics.

- **Bottom left:** health (teal bar) with a tiny four-bar **signal icon** that loses bars as health drops; at ≤25% it shows one flickering bar, a heartbeat thump plays and audio muffles slightly. Rage (yellow bar) underneath. Chase's quiver as four small note icons, lighting up through Faye's Chord.
- **Bottom right:** Runic Promo icons with radial cooldowns; a small axe icon showing *in hand* / *thrown*.
- **Top right:** pickup toasts (+SIMsilver, +Commission).
- **Top centre:** boss bar.
- **Over enemies** (after first hit): health, stun (yellow), frost overlay (teal crust).
- **Reticle** only while aiming.
- **Prompts:** runestone-styled keycaps that adapt to the active input device.

---

## 8. Progression in the Demo

A thin, real slice of the full game's systems, so players feel the loop.

### 8.1 Currency and XP

- **SIMsilver** drops: Churned 15 · Hold-Music 20 · Reviewer 30 · Brute 60 · Hamarr 600 · Mystery Shopper 100 each · breakable *returns bins* 5–20 · Stockroom Cages 150–300. Expect ~1,500 on the full path.
- **Commission** (XP) from kills, finishers and discoveries; spent on the KPI Tree.

### 8.2 Luke & Zane's Upgrades

| Item | Cost | Effect | Bark |
|---|---|---|---|
| **Cold Call Lv 2** | 300 | +15% damage, +10% frost build | **Luke:** "Someone's been chopping trees with this. Disrespectful." |
| **9H Screen Protector** (Tempered Guardian) | 250 | Block chip damage −50%, Price Match window +2 frames | **Luke** *(licking it)*: "Activates the adhesive." **Zane:** *(gagging)* |
| **Fresh Strings** (Treble Bow) | 200 | Quiver +1, arrow stun +20% | **Zane:** "I'm replacing the tape too. Don't argue." |
| **Thermal Fleece** (Luka armour) | 350 | +10% max health | **Luke:** "Faye's old size. Don't make it weird." |
| **Glacial Rebate** etching | Free (story) | Unlocks the light Runic Promo | — |

### 8.3 KPI Tree (demo slice)

Six nodes, unlocked with Commission. Everything else is shown greyed out as "Available in the full game".

| Node | Effect |
|---|---|
| **Upsell** | L, L, H sweep combo |
| **Wall Mount** | Thrown axe pins light enemies to walls |
| **Callback Strike** | The returning axe also adds 20 stun |
| **Hard Close** | Shield Bash breaks guards in one hit |
| **Chase: Grapple** | Unlocks Chase's choke hold |
| **Chase: Faye's Chord** | Unlocks the four-note shockwave |

### 8.4 Other Rewards

- **Iðunn Power Bank** — +10% max health (one in the demo, from the chime-phone puzzle).
- **Stockroom Cages** — locked mesh cages, each with three runic padlocks hidden nearby. Strike all three within 8 s (usually with throws) to open. Two in the demo: one holds **Conference Call**, the other a **Target Stone Shard** (+10% max Rage).

---

## 9. The World — Mid-Band Redcliffe

The demo takes place on a mythic, frozen version of the Redcliffe peninsula. Real local landmarks are folded in as myth: the red cliffs the town is named for, the jetty, the old Hornibrook Bridge, the transmission towers on the far mountain. It should feel like a real place that has been snowed in for three years and slowly turned into legend.

### 9.1 Layout (about 300 × 420 m)

```
                         N
          ┌───────────────────────────────────────────┐
          │  A  FAYE'S GROVE  (marked tree)            │
          │       ╲                                    │
          │        ╲ log carry path (70 m, downhill)   │
          │         ╲                                  │
          │   B  LONGHOUSE YARD — Store 001            │
          │      pyre · Faraday ring · cliff edge ▶ bay│
          │         │                                  │
          │         │ path                             │
          │   D  THE KIOSK (hollow stump)              │
          │         │                                  │
          │   E  ZEE'S CLEARING (frozen creek, mist)   │
          │         │                                  │
          │   C  CLIFF PATH ── red cliffs ── vistas    │
          │         │   ├── Stone of Three Brothers    │
          │         │   ├── JARVIS cairn               │
          │         │   ├── Tower Shrine               │
          │         │   └── F  JETTY detour (PREPAID)  │
          │         │                                  │
          │   G  HORNIBROOK RUINS  (queue · bridge deck · lair below)
          │         └── shortcut ladder ↑ back to C/B  │
          └───────────────────────────────────────────┘
               the Lake of Nine Bars (frozen bay) ▶ east
               the Mountain and its towers ▶ far south-west horizon
```

### 9.2 Areas

**A — Faye's Grove.** Tall pines and a few birches, deep powder snow, late-afternoon light in long shafts through the trunks. Fallen logs with snow caps, moss on the north sides of boulders, animal tracks. Only one tree has a yellow handprint.

**B — The Longhouse Yard (Store 001).** A timber longhouse with a carved shopfront gable, the YES runes on the lintel, icicles along the eaves, chimney smoke. A woodpile with a staff roster carved into its beam. A sled. Drying racks. Wind-chime phones in the birch by the door. The Faraday ring of rune posts and copper wire. The pyre on the old display-table frame near the cliff edge, the frozen bay behind. Lanterns made from old phone boxes. Footprints everywhere from the mourners.

**Inside the longhouse (Beat 11 only).** A carved timber sales counter, driftwood display tables holding carved wooden phones like museum pieces, a fire pit, Faye's empty chair with her lanyard on the back, the Best of the Month wall, a trapdoor behind the counter.

**D — The Kiosk.** A hollow stump big enough to park a cart in. Canvas awning, forge in a steel cabinet, cartwheel-sized laptop-fan bellows, pegboard of tools, spools of solder, rows of tiny screws in jars, a repair queue board, and the cart's lantern swinging.

**E — Zee's Clearing.** A frozen creek with clear black ice (fish shadows move beneath it), silver birches, low ground mist, a ring of stones. Softer, greener, quieter. Light here always looks like late morning.

**C — The Cliff Path.** A narrow track along the top of the red cliffs: layered red-orange sandstone dusted with snow, the frozen bay below, gulls riding the updraft. This is where the Optus palette happens naturally — teal ice, red rock, white snow, yellow lantern light. Vistas to the Mountain's blinking towers.

**F — The Jetty (detour).** The old jetty frozen into the bay, iced pylons, rails furred with frost, the boat PREPAID locked in the ice at the end, a pelican on the rail.

**G — The Hornibrook Ruins.** The broken bridge striding out over the ice: concrete spans, exposed rebar, a ruined toll booth with a glowing ticket machine, rows of rusted queue stanchions, the silent queue. Beneath the deck: Hamarr's lair — a mountain of returned items (shopping trolleys, cracked phones, a single shoe, a sign reading NO RETURNS WITHOUT RECEIPT), a dirty mattress of cables, the smell of resentment.

### 9.3 A Living World

| System | Detail |
|---|---|
| **Snowfall** | GPU-instanced flakes in a wrapping volume around the camera (6k–12k depending on quality). Density varies by area. Near flakes go through DOF and become bokeh. |
| **Wind** | Gusts every 20–40 s visibly sweep sheets of blown snow across the ground, bend trees (vertex-shader sway, stronger at the tips), flap cloaks and lanyards, and swing lanterns. |
| **Snow interaction** | Persistent footprint decals that slowly fill in. Snow falls from branches when brushed or hit. Luka's cloak gathers snow on the shoulders while idle and he shakes it off. Knockdowns throw up powder. |
| **Ice** | Icicles drip and can be shattered. Frozen surfaces have a fresnel sheen and faint subsurface tint. Clear ice shows fish shadows beneath. |
| **Breath** | Every character exhales visible fog; faster after combat. |
| **Wildlife** | Ravens (and the five Mystery Shoppers) · snow hares that bolt · a fox that watches from a distance · gulls and a pelican at the cliffs and jetty · soldier crabs scuttling on a patch of thawed sand below the cliffs · the **Upgrade Stag**, whose antlers are antenna arrays, glimpsed twice · a distant **wolf pack** crossing the ice, each wearing a little roaming tag · Hildis-Vinnie · the World Cable. |
| **Sky** | Gradient dome with slow procedural clouds. At night, a teal-and-gold aurora shader. The Mountain's tower lights blink on the horizon all game. |
| **Ambience** | Wind in pines, creaking ice, distant bell buoy, wind chimes, the World Cable's low call far across the bay, the ward's hum (until it dies). |

### 9.4 Easter Eggs (18)

Each counts toward the end-card tally and unlocks a short **Training Module** entry (the codex) in the pause menu.

| # | Egg | Where | Trigger and payoff |
|---|---|---|---|
| 1 | **The YES runes** | Longhouse lintel | Interact. The runes are ᛃᛖᛊ — a real Elder Futhark spelling of "Yes". **Chase:** "Y… E… S." **Luka:** "She carved that." The ward posts also read ᛟᛈᛏᚢᛊ. |
| 2 | **The staff roster** | Woodpile beam, yard | Carved: *SAT: CHASE · SUN: CHASE · MON–FRI: LUKA · ALWAYS: FAYE.* **Chase:** "I do a lot of Saturdays." |
| 3 | **The weathervane** | Longhouse roof | The old Yes sign that fell off the store wall, nailed up as a weathervane. **Luka:** "It fell off the wall. She said leave it up there." |
| 4 | **The esky note** | Esky in the snow by the door | *WHOEVER ATE MY YOGHURT — I KNOW. — Z.* |
| 5 | **Pudding — Demo Tape** | Shelf behind the kiosk | **Chase:** "Oh no. Oh no, they kept that." Changes the end-credits music. |
| 6 | **The repair queue board** | Kiosk | Tickets #0002–#0009, e.g. *#0004 · CUSTOMER: HILDIS-VINNIE · FAULT: SAT ON IT* and *#0007 · CUSTOMER: RUE · FAULT: CAN'T HANG UP · STATUS: AWAITING PARTS (SINCE 2019).* |
| 7 | **Ollie in the ice** | Zee's creek | Look down through the clear ice: an Ollie figure frozen inside, mid-wave (use the Ollie model from your other games). **Chase:** "Is that —" **Luka:** "Don't." |
| 8 | **The JARVIS cairn** | Cliff path | A chunky old terminal sealed in ice, a loading spinner turning forever. Interact: Luka hits it. *JARVIS is not responding.* **Chase:** "Have you tried turning it off and on again?" Luka hits it again. *JARVIS is restarting…* Same spinner. **Chase:** "…Classic." |
| 9 | **The wreck from another time** | Gully off the cliff path | A time machine built from display phones and a display table, half-buried in snow (a nod to *Rue*). **Chase:** "Should we… tell someone about this?" **Luka:** "No." **Chase:** "It's still on two percent." **Luka:** "Walk." |
| 10 | **The Stone of Three Brothers** | Cliff point | Three weathered stone figures with enormous hair (a nod to the Bee Gees, who grew up in Redcliffe). Stand close and the wind through them sounds a three-part falsetto chord — just a chord, no tune. **Chase:** "Are the rocks… harmonising?" |
| 11 | **The signpost** | Path fork | *SIGNAL HILL ← 40 · OPTUS CITY → · YES TOWN ↑ · HELPDESK: PLEASE HOLD.* |
| 12 | **The chime-phone puzzle** | Dead tree on the cliff | Four old brick phones hang from a branch, each tuned to one note. Hit them with throws in the order of Faye's motif (idle nearby and Chase hums it). Reward: Iðunn Power Bank. **Luka**, quietly: "…That's it." |
| 13 | **The Upgrade Stag's antler** | Ridge above the path | The stag bolts if you get within 15 m; its shed antenna-antler lies where it stood. **Chase:** "It's got five bars." |
| 14 | **The Tower Shrine** | Forest edge of the cliff path | A fallen lattice cell tower half-buried like an ancient ruin, with a three-panel carving on its base: a giant handing a lanyard to a small figure; a tower above the clouds; a figure with a bow and headphones. **Chase:** "Who carved this?" **Luka:** "…Old people." *(Full-game lore seed.)* |
| 15 | **The PREPAID** | End of the jetty | Locked in the ice. *The ice is too thick. For now.* **Chase:** "Who names a boat *Prepaid*?" **Luka:** "Faye." **Chase:** "…It's a good name." |
| 16 | **The trainee pelican** | Jetty rail | A pelican wearing a lanyard that reads TRAINEE. It follows you a short way, then loses interest. |
| 17 | **Ticket 4,818** | Hornibrook ticket machine, after the fight | Take another ticket: *NOW SERVING 002 · YOUR NUMBER: 4,818 · ESTIMATED WAIT: END OF FINANCIAL YEAR.* |
| 18 | **The returns policy** | Hamarr's lair, seen from the shortcut ladder | The sign: NO RETURNS WITHOUT RECEIPT. **Chase:** "He had a returns policy." |

### 9.5 Mystery Shoppers (5)

Green-eyed ravens with tiny clipboards, perched and scribbling. Knock them down with a thrown axe or Chase's arrow. Each pays 100 SIMsilver and bursts into black feathers and fluttering paperwork.

| # | Location | Chase |
|---|---|---|
| 1 | Longhouse gable (from Beat 4 onward) | "That's one less report." |
| 2 | Kiosk awning pole | "He gave us three stars! Rude." |
| 3 | Dead birch, Zee's clearing | "Do they report on us or on the store?" |
| 4 | Top of the Tower Shrine | "Mystery solved." |
| 5 | Toll booth roof, Hornibrook (can be hit mid-fight) | "Last one. Head Office is going to be so confused." |

---

## 10. Art Direction — PS2 Bones, Modern Lens

### 10.1 The Look in One Line

**A PS2 game, shot by a cinematographer.** The models and textures could have shipped in 2004. The camera, light and lens are 2026.

Clean, not crusty: no PS1 vertex wobble, no affine texture warping, no polygon jitter. (An optional *Retro Wobble* toggle exists, off by default.)

### 10.2 Palette

- **World:** snow whites, slate blues, pine greens, birch silver, red-orange cliff sandstone, black ice.
- **Warmth:** firelight amber, lantern yellow.
- **Brand accents (used as light, not paint):** Optus-style teal (runes, the axe window, Churned eyes, the World Cable's pulses) and yellow (lanterns, the handprint, Rage, Target Stones).
- **Head Office green:** a sicker, colder green, used only for Mystery Shoppers and anything from above — so "other" reads instantly.

### 10.3 Geometry Budgets

| Asset | Triangles | Notes |
|---|---|---|
| Luka | ~2,800 | Hero detail on face, hands, cloak |
| Chase | ~2,200 | |
| Other humans | ~1,800 | Rue is rendered small on a slate, but modelled at this level |
| Churned | ~900 | 6 variants via part swaps and vertex colour |
| Brute | ~1,400 | |
| Dodgy Hamarr | ~4,500 | |
| World Cable | ~6,000 | Instanced segments |
| Pine tree | 150–300 | 3 LODs + far impostor card |
| **Total visible** | **≤ 300k** | Hard ceiling on High |

### 10.4 Textures

- **All procedural**, drawn to canvas at boot: 32–128 px, with a small hand-picked palette per texture (≈16–32 colours) for era authenticity.
- **Filtering:** magnification **nearest** (crisp texels up close), minification **linear mipmapped** (no shimmer at distance). Optional *Smooth* filtering toggle.
- **Faces:** 128 px atlas per character, painted in code: eyes, brows, stubble/moustache, and **4 mouth frames + 2 blink frames** swapped at runtime — a genuine PS2-era trick.
- **Vertex colours** carry baked ambient occlusion and colour variation (computed once at load by ray-sampling each vertex against nearby geometry).
- **Snow on top:** a world-space shader blend adds snow to any up-facing surface, so every prop sits in the weather with no extra art.
- **Snow sparkle:** screen-space glints on snow where a noise threshold meets the light direction. A cheap, very modern touch.
- **Text and runes:** runes are built as straight-stroke line geometry (Elder Futhark is all straight strokes), so they work with no font dependency. Signage text is drawn to canvas.

### 10.5 Building Characters From Primitives

Every character is a code-built, segmented low-poly figure: a bone hierarchy where each bone owns a mesh made from bevelled boxes, tapered cylinders, lathe shapes and a sculpted head.

- `buildHumanoid(spec)` takes proportions (height, shoulder width, belly, limb thickness), then attaches parts: head, hair, torso, cloak, satchel, lanyard, props.
- **Heads:** a subdivided icosphere pushed into shape (brow ridge, cheekbones, jaw, nose wedge) with a painted face atlas.
- **Hair:** Luka's ponytail is a verlet chain of tapered segments. Chase's wavy hair is a cluster of low-poly clumps. Rue's parted silver hair is a sculpted cap.
- **Cloth:** cloaks are 6×8 verlet grids pinned at the shoulders, rendered double-sided. Lanyards and headphone cables are 6-point verlet chains.
- **Joints:** overlapping caps at elbows and knees hide seams, the classic segmented-model approach.

| Character | Height | Build notes |
|---|---|---|
| Luka | 1.88 m | Broad shoulders, forward lean, heavy cloak |
| Chase | 1.78 m | Slimmer, puffer vest volume, hood down |
| Rue | 1.76 m | Upright, blazer silhouette |
| Luke | 1.85 m | Wide, chunky gloves |
| Zane | 1.80 m | Narrow, upright, tidy |
| Zee | 1.83 m | Long cloak to the ground, hood |
| Jarrad | 1.84 m | Athletic, open posture, sleeves rolled |
| Hamarr | 6.0 m | Hunched, huge forearms, small head |

### 10.6 Animation

- **Pose library:** key poses authored in code as per-bone quaternions, tweened with easing curves. Attack animations follow anticipation (startup) → **smear frames** (1–2 frames of mesh stretch along the swing, PS2-style) → follow-through.
- **State machine:** idle (breathing), walk, run, sprint, carry, combat idle, light/heavy chains, throw/catch, shield, dodge/roll, hit reactions, finishers, cinematic gestures.
- **Procedural layers on top:** two-bone foot IK on terrain, look-at IK, spine lean into turns, additive breathing, verlet secondary motion.
- **Enemies:** Churned shamble with per-instance timing offsets so crowds never sync. Deaths become a constrained verlet ragdoll.

### 10.7 Lighting

- Hemisphere light (sky blue above, snow bounce below).
- One directional key (sun, then moon) with shadows: near cascade 20 m at 2,048 px, far cascade 80 m at 1,024 px (High preset).
- Up to 4 active fire/lantern point lights with flicker noise. **The light count never changes at runtime** — lights are switched by intensity, not added or removed, to avoid shader recompiles.
- Emissive runes, axe window, Churned eyes.
- Exponential height fog with sun-direction inscattering in the material shaders.
- Sky dome, procedural clouds, night aurora shader.

### 10.8 Post-Processing Stack (in order)

| # | Pass | Resolution | Notes |
|---|---|---|---|
| 1 | Scene render | Internal (dynamic, 50–100%) | Half-float target, depth texture |
| 2 | Circle of confusion | Half | From the lens model (§5.2); separates near and far fields |
| 3 | Bokeh gather | Half | Single-pass golden-angle disc gather, 32–48 taps; near field blurred over sharp, far field behind |
| 4 | DOF composite | Internal | Blends sharp and blurred by CoC |
| 5 | Heat haze | Internal | Screen-space distortion from a mask drawn by the fire's particles |
| 6 | God rays | Quarter | Radial blur of an occlusion mask from the sun, moon or pyre; only when a strong source is on screen |
| 7 | Bloom | Mip chain | 5-level dual-filter down/up; threshold ≈ 0.9 |
| 8 | Final | Screen | ACES-style tonemap → per-scene grade (lift/gamma/gain, saturation, tint) → chromatic aberration (edge-weighted, ≤0.6 px) → vignette → film grain (animated, luminance-weighted) → light ordered dither to kill banding in fog |
| 9 | Camera motion blur | Internal | Only during whip pans and Rage; off on Low |

Target post cost: under 4 ms at 1080p on a mid-range laptop GPU.

### 10.9 Per-Scene Grading

| Scene | Grade |
|---|---|
| Title vista | Cold blue, lifted blacks, low saturation |
| Grove, afternoon | Neutral, warm highlights, soft contrast |
| Pyre at dusk | Amber highlights, teal shadows, bloom up |
| Smoke wipe | Near-white, low contrast |
| Embers at night | Deep blue, amber key from the embers, aurora teal-gold |
| Ward falls / combat I | −15% saturation, cooler shadows |
| Zee's clearing | Green-grey mist, soft, gentle |
| Cliff path | Crisp, higher contrast, red cliffs pop |
| Hornibrook | Overcast grey, cyan shadows, ice fog |
| Boss | Higher contrast; red-gold push during Rage |
| Longhouse interior | Amber, heavy vignette |

### 10.10 VFX List

Snowfall · wind-blown snow sheets · breath fog · pyre fire (particles + flickering light + heat haze) · smoke column (soft particles) · embers · axe frost trail (ribbon of the last 8 frames) · frozen-enemy ice crust (shell mesh) · frost shards · teal-black ichor · hit flashes · rune glow and failure sparks · the World Cable's light pulses · Hold-Music swell rings · Comment Storm bubble shards with red decals · footprints · snow puffs · icicle shatter · Zee's gentle reset spiral · aurora · Rage tint.

### 10.11 UI Style

- **Display type:** a carved Roman-style serif (e.g. Cinzel via Google Fonts, with a system serif fallback so the file still works offline) for the title, name cards, boss titles and the death screen.
- **Body type:** a clean sans for subtitles, prompts and menus.
- **Materials:** UI panels look like dark slate with carved edges; accent lines in teal; selections glow yellow.
- **Pause menu: ON BREAK** — Resume · Settings · Controls · Training Modules (codex) · Quit to Title.

---

## 11. Audio

All audio is synthesised in WebAudio at runtime. No audio files.

### 11.1 Score

**Faye's Theme** — the four-note motif: **D – F – A – G** (half, quarter, quarter, whole) in D minor. It's what Faye hummed, what Chase hums, what the chime phones play, and what Chase's arrows build toward.

**Instruments (synth recipes):**
- **Choir** — sawtooth stacks through parallel formant band-passes ("ah" and "oh" vowels), slow attack, wide reverb.
- **Low strings** — detuned saws, low-pass, slow swell.
- **Solo cello** — filtered saw with delayed vibrato and bow-noise layer.
- **Taiko / frame drum** — pitch-dropping sine plus a noise transient.
- **Brass stab** — saw with a fast filter envelope.
- **Bells** — two-operator FM.

| Cue | Where | Character |
|---|---|---|
| **Title** | Beat 0 | Choir drone, wind, cello motif every ~40 s |
| **Wi-Faye** | Beat 3 | Solo strings, sparse; full choir + strings on the motif when the pyre is lit |
| **The World Cable** | Beat 3.7 | Sub-bass swell, choir "oh", the Cable's call |
| **The Ward Falls** | Beat 4 | Taiko, brass stabs, choir shouts |
| **Combat** | All fights | Three layers: base percussion / intensity (strings, brass) / Rage (heavy drums). Driven by active attackers and Luka's health |
| **Zee** | Beat 6 | Harp-like plucked FM, warm pad |
| **Exploration** | Path | Very sparse, mostly ambience, occasional motif fragments |
| **The Queue** | Beat 8 | Music drops to nothing; just the ticket machine's tick |
| **Dodgy Hamarr** | Beat 9 | Heavy drums and a pitched-down male-choir chant on his name |
| **The Knock** | Beat 11 | Silence, then one low string |
| **Credits** | End | A lo-fi beat built on the motif — or the *Pudding* track, if found |

### 11.2 Sound Effects

| Sound | Recipe |
|---|---|
| Axe swing | Band-passed noise sweep |
| Frost crack | Noise burst, high-pass, short metallic FM ring |
| Body impacts | Low sine thump + filtered noise |
| Throw | A rising tremolo tone — a phone about to ring |
| Callback | A two-tone notification-style chime (original) |
| Catch | Low thunk + leather creak |
| Snow footsteps | Granular filtered-noise crunch, varied per step |
| Ward hum | 60/120 Hz with soft harmonics; the failure is a falling whine with crackle |
| World Cable call | A dial-tone-like pair of sines that glides like whale song |
| **Hold music** | An original, aggressively bland muzak loop (electric-piano FM, bossa groove), band-passed to telephone range (300–3,400 Hz) and lightly bit-crushed |
| Flip-phone lighter | An original 8-note polyphonic jingle |
| Rue's ringtone | An original cheerful ringtone |
| Ticket machine | Bright ding + paper feed |
| Churned muttering | Character babble, low-passed, with reverb |
| Hamarr | Pitched-down noise + formant roar |
| Comment Storm | Glassy impacts |
| Death | Busy tone through a low-pass |

**Spatial audio:** HRTF panners on key sources (frozen enemies' hold music, the Cable, Chase). Procedurally generated impulse responses for each space (forest, yard, interior, under the bridge).

### 11.3 Voices

By default, dialogue is subtitled and voiced with **character babble** — syllable-rate synthesised speech-like sound with a per-character pitch, timbre and inflection, which also drives lip flap. An optional setting switches to the browser's speech synthesis using the same per-character pitch and rate.

| Character | Base pitch | Syllables/s | Contour | Treatment |
|---|---|---|---|---|
| Luka | 85 Hz | 3.2 | Flat, falling ends | Close, dry |
| Chase | 130 Hz | 5.0 | Rising, quick | — |
| Rue | 115 Hz | 4.0 | Lilting | **Telephone EQ** + occasional dropout |
| Luke | 95 Hz | 4.5 | Loud, punchy | Slight overdrive |
| Zane | 145 Hz | 5.2 | Clipped | — |
| Zee | 205 Hz | 3.6 | Soft, breathy | Extra reverb |
| Jarrad | 125 Hz | 5.5 | Constant upward inflection | Bright EQ |
| Hamarr | 55 Hz | 2.5 | Shouted | Formant growl |
| Churned | 70–110 Hz | 2.0 | Moaning | Low-passed |

---

## 12. Technical Architecture

### 12.1 Stack

- **One `.html` file.** All code, shaders and UI inline.
- **Three.js** as an ES module via an import map from `cdn.jsdelivr.net` (pin an exact version). No other runtime libraries.
- Custom post-processing shaders (not the stock DOF pass — the lens model needs physical CoC and near/far fields).
- WebAudio, Gamepad API, Pointer Lock, touch events.
- **No external models, textures or audio.** Everything is generated at boot.
- Optional Google Fonts for display type, with fallbacks.

### 12.2 Code Layout Inside the File

```
<!-- ================= CONFIG ================= -->      quality presets, difficulty tables, tuning numbers
<!-- ================= UTIL =================== -->      math, springs, simplex noise, pools, RNG, easing
<!-- ================= RENDER ================= -->      renderer, render targets, post passes, shaders, dynamic resolution
<!-- ================= ASSETS ================= -->      canvas textures, geometry builders, character builders, rune strokes
<!-- ================= ANIMATION ============== -->      skeleton, pose library, state machine, IK, verlet
<!-- ================= CAMERA ================= -->      Operator, lens, focus puller, handheld, gameplay camera
<!-- ================= DIRECTOR =============== -->      scene DSL runtime, scenes, marks, wipes, checkpoints
<!-- ================= DIALOGUE =============== -->      subtitles, name cards, babble, barks, walk-and-talk
<!-- ================= AUDIO ================== -->      synth voices, score engine, SFX, reverbs, spatial
<!-- ================= INPUT ================== -->      keyboard/mouse, gamepad, touch UI, buffer, remapping
<!-- ================= GAMEPLAY =============== -->      Luka, combat, Cold Call, Chase AI, enemies, boss, pickups
<!-- ================= WORLD ================== -->      terrain, foliage instancing, weather, wildlife, eggs, collectibles
<!-- ================= UI ===================== -->      title, HUD, pause, settings, end card, death screen
<!-- ================= MAIN =================== -->      boot, warm-up, fixed-step loop
```

### 12.3 The Loop

- **Fixed 60 Hz simulation** (accumulator), rendering interpolated between states.
- Per-frame order: input → director → gameplay (Luka, Chase, enemies, projectiles) → physics/collision → animation (state → pose → IK → verlet) → camera operator → audio listener → render → post → UI.

### 12.4 No Stutters

The previous Optus games' bar — fast, no big hitches — is a hard requirement.

- **Warm up everything behind the title screen:** compile every material and shader variant, render every VFX type once off-screen, upload every texture, pre-build every particle and enemy pool.
- **Constant shader permutations:** fixed light count (toggle intensity, never add or remove lights), shadows always on or always off per preset, shared materials driven by uniforms.
- **Zero allocations in the loop:** reuse vectors, matrices and arrays; pooled particles, projectiles, decals and enemies.
- **Boot-time generation** of the whole demo world (target < 3 s), so the one take never pauses to load.
- Dev overlay flags any frame over 20 ms with a stack of what ran.

### 12.5 Performance Budget and Presets

| | **Mobile** | **Balanced** | **High** | **Ultra** |
|---|---|---|---|---|
| Target | 30 or 60 fps | 60 fps | 60 fps | 60+ fps |
| Internal resolution | 55% | 75% (dynamic) | 100% (dynamic) | 100% |
| DOF taps | 16 | 32 | 40 | 48 |
| Shadows | 1 cascade, 1,024 | 2 cascades, 1,024 | 2,048 / 1,024 | 4,096 / 2,048 |
| God rays | Off | On | On | On |
| Snowflakes | 4k | 8k | 10k | 12k |
| Motion blur | Off | Whips only | On | On |
| Draw calls | < 120 | < 150 | < 180 | < 220 |

**Dynamic resolution:** measure GPU time (timer queries where supported, otherwise frame delta), and move internal resolution in 5% steps between 50–100% to hold the target.

### 12.6 World and Collision

- The entire demo world is built at boot and grouped into zones; zones out of range are hidden, foliage is instanced with LODs and far impostors.
- **Collision without a physics library:** capsule vs heightfield terrain, plus static boxes, cylinders and capsules in a spatial hash. Enemy separation via soft repulsion. Projectiles raycast against simple shapes.
- **Navigation:** a coarse grid of walkable cells per zone with A* for Chase and enemies, plus local steering.

### 12.7 Saves and Settings

`localStorage` (always wrapped in try/catch; the game works fully without it) stores settings, last checkpoint, collectibles, eggs found and trophies. Checkpoints: `pyre_start`, `pyre_embers`, `ward_falls`, `zee`, `queue`, `hamarr`, `walk_home`, `knock`.

### 12.8 Debug Build (`?debug=1`)

FPS and frame-time graph · draw calls and triangles · timeline scrubber for the director · free-fly camera · jump to any checkpoint · god mode · show colliders, marks and navigation · wipe coverage meter · force any enemy spawn.

### 12.9 Hub Integration

Drop the file at `games/god-of-warranty.html` and the thumbnail at `thumbnails/god-of-warranty.png`, then add the card:

```js
{
  title: 'God of Warranty',
  description: 'A 2IC, a casual, and a satchel of ashes. One unbroken take. (Demo)',
  image: 'thumbnails/god-of-warranty.png',
  url: 'games/god-of-warranty.html'
}
```

The end card's **Back to Optus Games** button links to the hub. The parody / fair-dealing disclaimer appears in the game's credits as well as on the hub.

---

## 13. Settings and Accessibility

| Category | Options |
|---|---|
| **Difficulty** | The four plans (§7.13), changeable any time |
| **Camera** | Sensitivity, invert X/Y, FOV offset (±10°), camera shake (0–100%), handheld intensity in cinematics (0–100%), lock-on on/off |
| **Image** | Quality preset, internal resolution, depth of field on/off, film grain, chromatic aberration, motion blur, bloom, texture filtering (Crisp/Smooth), *Authentic 480p* mode, *Retro Wobble* (off by default) |
| **Content** | Gore (Full/Reduced), name cards on/off |
| **Subtitles** | On/off, size (S/M/L/XL), background box, speaker names and colours |
| **Audio** | Master, music, effects, dialogue; babble or browser speech voices |
| **Controls** | Full remapping, hold or toggle for Aim and Shield, aim assist strength, auto-sprint |
| **Assists** | Colour-blind threat indicator palettes (plus shape coding), slower enemy tells (+20%), auto-Price Match on *Give Me a Story*, skip finisher animations |
| **HUD** | Full / Minimal / Off |

Skipping cinematics: hold **Pause** for 1 s during a scene to skip it. Even when skipped, the camera blends to gameplay rather than cutting.

---

## 14. Build Plan

### 14.1 Milestones

| # | Milestone | Done when… |
|---|---|---|
| **M0** | **Engine and lens** | Renderer, post stack with physical DOF, Operator with springs and handheld layers, input on all three devices, a test scene with snow holding 60 fps on Balanced. |
| **M1** | **Bodies** | Luka and Chase built from primitives, face atlases with mouth and blink swaps, locomotion state machine, foot IK, verlet cloak, ponytail and lanyards. |
| **M2** | **The Director** | Scene DSL, marks, focus puller, `favour`, handoffs both ways, a smoke wipe, subtitles and babble. **Proof: Beats 1–2 playable end to end with no cuts.** |
| **M3** | **Combat core** | Luka's moveset, Cold Call throw/freeze/Callback, shield and Price Match, Chase's arrows and commands, Churned + Brute + Hold-Music AI, tokens, indicators, hit feel, *Call Dropped*. **Proof: Beat 4 fights feel good.** |
| **M4** | **The world** | All areas built and dressed, weather, wildlife, grading per scene, the World Cable. |
| **M5** | **The whole take — Core** | Beats 0, 1, 2, 3, 4, 6, 9, 11 playable start to finish, including Dodgy Hamarr and the end card. |
| **M6** | **Stretch** | Kiosk and upgrades, cliff path and eggs, the Queue fight and Reviewers, Runic Promos, KPI Tree slice, trophies. |
| **M7** | **Polish and performance** | Shader warm-up, dynamic resolution, presets, full score, settings and accessibility, stinger, hub integration. |

### 14.2 Definition of Done (Demo)

- Opens from the hub and from a local double-click with no console errors.
- Playable start to finish on keyboard and mouse, gamepad, and touch.
- **Zero camera cuts** between *Begin Shift* and the end card (the only fade is after *Call Back*).
- 60 fps on Balanced on a mid-range laptop; no frame over 50 ms after the title screen.
- All seven characters introduced with their name cards; Rue's eulogy explains the premise; every motif plant in §2.6 is present.
- Full path runs about 25 minutes; Core path about 15.

### 14.3 Risks

| Risk | Mitigation |
|---|---|
| DOF too expensive on phones | Half-res gather, 16 taps on Mobile, DOF toggle; cinematics keep a cheaper "gaussian" DOF fallback |
| One-take scenes are fragile when the player is in an odd spot | Every scene starts `from: 'current'` with auto-walk to marks; soft handoffs; designer marks tested from multiple approach angles |
| Primitive-built characters look amateur | Spend the polygon budget on faces, hands and silhouettes; strong painted face atlases; secondary motion; good lighting does the rest |
| File size and boot time | All procedural; generate geometry once and reuse via instancing; keep total boot under 3 s |
| Tone tipping into pure parody | Tone rules in §1.2; each emotional beat played straight, jokes after |

---

## 15. Appendix

### 15.1 Bark Lists

**Chase — combat**
- "Behind you!" · "Left side!" · "Right side!" · "Incoming — star!"
- "He's got a stanchion!"
- "Why is that one humming — why is it HUMMING —"
- "Your call is important to us."
- "Is it weird that the dead customers still want to speak to the manager?"
- "Nice! …I mean, that was horrible. Nice."
- "I'm out of notes!" · "Reloading — re-tuning — whatever!"
- "HOLD STILL, SIR!"
- "Ow — I'm fine — I'm fine."
- "Got his attention!"
- "That one's frozen. Do your thing."
- "Okay, that's a lot of customers."
- "Do they ever stop complaining?" / *(beat)* "…Fair, actually."

**Chase — after combat (resuming conversation)**
- "Anyway — as I was saying —"
- "Where was I? Something about… oh, right."
- "Okay. Okay. I'm good. Are you good? You look good. You always look the same."

**Luka**
- "Casual." · "Focus." · "Stay close." · "Now." · "Again." · "Behind me." · "Move." · "Shoot." · "Enough."
- *(Never "Good" — reserved for the boss fight.)*

**Churned mutters**
- "…cancel… my… contract…"
- "…I want to speak… to the manager…"
- "…I've been… on hold…"
- "…it was working… yesterday…"
- "…I'm not paying… for that…"
- "…can you just… check the system…"
- "…my nephew… does computers…"
- "…I'll take my business… elsewhere…"

### 15.2 Trophies (Demo)

| Trophy | How |
|---|---|
| **Full Bars** | Finish the demo |
| **Your Call Is Important to Us** | Freeze 25 enemies |
| **Callback** | Kill an enemy with the returning axe |
| **Price Match Guaranteed** | 10 Price Matches |
| **Early Termination Fee** | Perform every finisher |
| **Mystery Solved** | Knock down all 5 Mystery Shoppers |
| **Faye's Song** | Solve the chime-phone puzzle |
| **Not Brothers** | Ask Luke and Zane if they're brothers three times |
| **Ratio'd** | Break free of Hamarr's Reply grab yourself |
| **…ok. fair enough.** | Defeat Dodgy Hamarr |
| **Please Hold** | Freeze a Hold-Music Churned mid-swell |
| **Turn It Off and On Again** | Restart the JARVIS cairn |
| **Good.** | *(Story)* Hear Luka say it |
| **Every Egg in the Basket** | Find all 18 easter eggs |
| **Give Me God of Warranty** | Finish on the hardest plan |

### 15.3 Quick Glossary

**2IC** — second in charge · **Casual** — what Luka calls Chase · **The Cold Call** — the axe · **Callback** — recalling it · **On Hold** — frozen · **Price Match** — parry · **Close the Deal** — finisher · **End-of-Month Rage** — rage mode · **Runic Promos** — special attacks · **SIMsilver** — money · **Commission** — XP · **KPI Tree** — skill tree · **Churned** — the restless dead · **Mystery Shoppers** — Head Office's ravens · **The Faraday Ward** — Faye's protection · **Helpdesk** — the land of the dead, on hold · **The World Cable** — the serpent · **Call Dropped** — you died.


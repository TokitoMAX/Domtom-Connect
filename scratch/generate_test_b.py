import edge_tts
import asyncio
import json

# Script Option B : Prise de conscience sincère, sans deux-points, sans tirets au milieu des phrases
script_b = """Il y a une grande illusion chez nous, dans les îles et dans la diaspora.
C'est de croire qu'un vrai chef d'entreprise doit tout porter tout seul sur ses épaules.
Faire le commercial, faire la gestion, régler les livraisons, éteindre chaque incendie.
Sauf qu'un dirigeant qui passe ses journées la tête sous l'eau dans l'opérationnel, c'est un dirigeant qui empêche sa propre entreprise de grandir.
Ta vraie valeur, elle n'est pas dans les tâches chronophages qui te vident de ton énergie.
Ta vraie valeur, elle est dans ta vision et dans tes décisions.
Arrête de vouloir être un super-héros tout seul dans ton coin.
Apprends à t'entourer pour respirer et avancer.
Stay Co."""

async def main():
    # Cadence posée, chaleureuse et sincère
    tts = edge_tts.Communicate(script_b.strip(), 'fr-FR-HenriNeural', rate='+1%')
    sentences = []
    
    with open('assets/audio/test_b_audio.mp3', 'wb') as f:
        async for chunk in tts.stream():
            if chunk['type'] == 'audio':
                f.write(chunk['data'])
            elif chunk['type'] == 'SentenceBoundary':
                start_sec = chunk['offset'] / 10_000_000.0
                dur_sec = chunk['duration'] / 10_000_000.0
                sentences.append({
                    'start': round(start_sec, 2),
                    'end': round(start_sec + dur_sec, 2),
                    'text': chunk['text']
                })
                
    with open('assets/audio/test_b_sync.json', 'w', encoding='utf-8') as jf:
        json.dump(sentences, jf, ensure_ascii=False, indent=2)
        
    print(f"Option B audio generated! Total sentences: {len(sentences)}")

if __name__ == '__main__':
    asyncio.run(main())

import edge_tts
import asyncio
import json

script_punch = """Monter une boîte ? Gérer une boîte ? C'est jamais simple.
Tu te sens bloqué ? Débordé ? Seul face à tes galères ?
Chez Domme Tomme Connect, zéro blabla.
On n'a pas la science infuse. On ne prétend pas être meilleurs que toi.
Mais notre rôle, il est clair.
On s'assoit avec toi. On écoute tes vrais blocages.
On structure. On copilote. On avance en tête-à-tête.
Tout seul dans ton coin, tu stagnes.
Ensemble, on débloque tout.
Caraïbes, Afrique, diaspora : viens échanger avec nous.
Stay Co."""

async def generate():
    tts = edge_tts.Communicate(script_punch.strip(), 'fr-FR-HenriNeural', rate='+16%')
    sentences = []
    with open('assets/audio/pilote_straight_to_point.mp3', 'wb') as f:
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
    
    with open('assets/audio/sentences_sync.json', 'w', encoding='utf-8') as jf:
        json.dump(sentences, jf, ensure_ascii=False, indent=2)
    print(f"Extracted {len(sentences)} sentence boundaries successfully.")

if __name__ == '__main__':
    asyncio.run(generate())

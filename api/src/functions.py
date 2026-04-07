from urllib.request import urlopen

import requests
import torch
from fastapi import HTTPException
from PIL import Image
from transformers import (
    AutoModelForCausalLM,
    AutoProcessor,
    BitsAndBytesConfig,
    Qwen2_5_VLForConditionalGeneration,
)


def load_processors(vision_model: str, llm_model: str) -> dict:
    vlm_prc = AutoProcessor.from_pretrained(vision_model)
    llm_prc = AutoProcessor.from_pretrained(llm_model)

    return {"vlm": vlm_prc, "llm": llm_prc}


def load_models(vision_model: str, llm_model: str) -> dict:
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_use_double_quant=True,
        bnb_4bit_compute_dtype=torch.bfloat16,
    )
    nlp_model = AutoModelForCausalLM.from_pretrained(
        llm_model,
        quantization_config=bnb_config,
        device_map="auto",
        torch_dtype=torch.bfloat16,
    )

    v_model = Qwen2_5_VLForConditionalGeneration.from_pretrained(
        vision_model,
        quantization_config=bnb_config,
        device_map="auto",
        torch_dtype=torch.bfloat16,
    )

    return {"vlm": v_model, "llm": nlp_model}


def inference(
    model: Qwen2_5_VLForConditionalGeneration | AutoModelForCausalLM,
    processor: AutoProcessor,
    flag: bool,
    user_data: str,
) -> str:

    taco_reference = (
        "Tabela de referencia nutricional (valores por 100g do alimento pronto/cozido):\n"
        "- Arroz branco cozido: 128 kcal, 2.5g proteina, 28.1g carbs, 0.2g gordura, 1.6g fibra\n"
        "- Arroz integral cozido: 124 kcal, 2.6g proteina, 25.8g carbs, 1.0g gordura, 2.7g fibra\n"
        "- Feijao preto cozido: 77 kcal, 4.5g proteina, 14.0g carbs, 0.5g gordura, 8.3g fibra\n"
        "- Feijao carioca cozido: 77 kcal, 4.5g proteina, 14.0g carbs, 0.5g gordura, 8.3g fibra\n"
        "- Frango grelhado: 159 kcal, 28.0g proteina, 0g carbs, 5.0g gordura, 0g fibra\n"
        "- Carne bovina grelhada: 279 kcal, 27.0g proteina, 0g carbs, 18.0g gordura, 0g fibra\n"
        "- Carne de porco assada: 254 kcal, 25.0g proteina, 0g carbs, 17.0g gordura, 0g fibra\n"
        "- File de peixe grelhado: 122 kcal, 22.0g proteina, 0g carbs, 3.5g gordura, 0g fibra\n"
        "- Ovo frito: 195 kcal, 13.0g proteina, 0.8g carbs, 15.0g gordura, 0g fibra\n"
        "- Ovo cozido: 146 kcal, 13.0g proteina, 0.6g carbs, 10.0g gordura, 0g fibra\n"
        "- Batata inglesa cozida: 57 kcal, 1.5g proteina, 13.0g carbs, 0.1g gordura, 1.1g fibra\n"
        "- Batata doce cozida: 77 kcal, 0.6g proteina, 18.0g carbs, 0.1g gordura, 1.3g fibra\n"
        "- Macarrao cozido: 94 kcal, 2.8g proteina, 19.0g carbs, 0.4g gordura, 1.4g fibra\n"
        "- Farofa simples: 394 kcal, 3.0g proteina, 74.0g carbs, 8.5g gordura, 3.5g fibra\n"
        "- Salada alface: 14 kcal, 1.2g proteina, 2.3g carbs, 0.2g gordura, 1.4g fibra\n"
        "- Salada tomate: 15 kcal, 0.9g proteina, 2.9g carbs, 0.2g gordura, 1.2g fibra\n"
        "- Strogonoff de carne: 179 kcal, 13.0g proteina, 4.5g carbs, 12.0g gordura, 0.5g fibra\n"
        "- Strogonoff de frango: 152 kcal, 14.0g proteina, 4.0g carbs, 9.0g gordura, 0.4g fibra\n"
        "- Legumes salteados: 45 kcal, 2.0g proteina, 7.0g carbs, 1.5g gordura, 3.0g fibra\n"
        "- Banana: 92 kcal, 1.3g proteina, 23.0g carbs, 0.1g gordura, 1.9g fibra\n"
        "- Laranja: 47 kcal, 0.9g proteina, 11.0g carbs, 0.1g gordura, 2.2g fibra\n"
        "- Pao frances: 300 kcal, 8.0g proteina, 54.0g carbs, 5.0g gordura, 2.0g fibra\n"
        "- Queijo mussarela: 330 kcal, 24.0g proteina, 3.0g carbs, 25.0g gordura, 0g fibra\n"
        "- Pizza de mussarela: 268 kcal, 11.0g proteina, 33.0g carbs, 10.0g gordura, 1.6g fibra\n"
        "- Hamburguer caseiro grelhado: 257 kcal, 17.0g proteina, 0g carbs, 20.0g gordura, 0g fibra\n"
        "- Azeite de oliva (1 col. sopa = 13g): 108 kcal, 0g proteina, 0g carbs, 13.0g gordura, 0g fibra\n"
    )

    if flag:
        image_url = user_data
        try:
            image = Image.open(urlopen(image_url)).convert("RGB")
        except:
            raise HTTPException(status_code=404, detail="Imagem Inválida")
        # Lista de referencia nutricional baseada na TACO (alimentos mais comuns)
        # Formato: "alimento (por 100g): kcal, proteinas, carbs, gorduras, fibras"

        prompt_text = (
            "Você é um especialista em nutricao e analise de imagens de alimentos.\n"
            "Analise a imagem com atencao e identifique TODOS os itens alimenticios visiveis.\n"
            "Para cada item, estime o peso em gramas com base no tamanho aparente e no contexto do prato.\n"
            "Use a tabela nutricional de referencia abaixo para calcular calorias e macronutrientes "
            "de forma proporcional ao peso estimado de cada alimento. Podem existir outros alimentos que não estejam contidos nesta tabela.\n"
            "Caso isso aconteça, retorne apenas a quantidae dos alimentos, sem necessidade para o cálculo de calorias.\n"
            f"{taco_reference}\n\n"
            "Retorne APENAS um JSON valido com a seguinte estrutura:\n"
            "{\n"
            '  "itens": [\n'
            "    {\n"
            '      "nome": "nome do alimento",\n'
            '      "peso_gramas": numero,\n'
            '      "calorias_kcal": numero,\n'
            '      "proteinas_g": numero,\n'
            '      "carboidratos_g": numero,\n'
            '      "gorduras_g": numero,\n'
            '      "fibras_g": numero\n'
            "    }\n"
            "  ],\n"
            '  "totais": {\n'
            '    "calorias_kcal": numero,\n'
            '    "proteinas_g": numero,\n'
            '    "carboidratos_g": numero,\n'
            '    "gorduras_g": numero,\n'
            '    "fibras_g": numero\n'
            "  }\n"
            "}\n\n"
            "Nao inclua explicacoes antes ou depois do JSON. Use numeros, nao strings. "
            "Calcule os macronutrientes de forma proporcional ao peso usando os valores de referencia por 100g."
        )

        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "image", "image": image},
                    {"type": "text", "text": prompt_text},
                ],
            }
        ]

        text = processor.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )

        inputs = processor(
            text=[text], images=[image], padding=True, return_tensors="pt"
        )
    else:
        prompt_text = (
            "Você é um especialista em nutricao e analise de alimentos.\n"
            "Analise os dados com atencao e identifique TODOS os alimentos no texto\n"
            "Para cada item, recebendo o peso em gramas deve estipular calorias e macronutrientes.\n"
            "Use a tabela nutricional de referencia abaixo para calcular calorias e macronutrientes "
            "de forma proporcional ao peso estimado de cada alimento. Podem existir outros alimentos que não estejam contidos nesta tabela.\n"
            "Caso isso aconteça, retorne apenas a quantidae dos alimentos, sem necessidade para o cálculo de calorias.\n"
            f"{taco_reference}\n\n"
            "Retorne APENAS um JSON valido com a seguinte estrutura:\n"
            "{\n"
            '  "itens": [\n'
            "    {\n"
            '      "nome": "nome do alimento",\n'
            '      "peso_gramas": numero,\n'
            '      "calorias_kcal": numero,\n'
            '      "proteinas_g": numero,\n'
            '      "carboidratos_g": numero,\n'
            '      "gorduras_g": numero,\n'
            '      "fibras_g": numero\n'
            "    }\n"
            "  ],\n"
            '  "totais": {\n'
            '    "calorias_kcal": numero,\n'
            '    "proteinas_g": numero,\n'
            '    "carboidratos_g": numero,\n'
            '    "gorduras_g": numero,\n'
            '    "fibras_g": numero\n'
            "  }\n"
            "}\n\n"
            "Nao inclua explicacoes antes ou depois do JSON. Use numeros, nao strings. "
            "Calcule os macronutrientes de forma proporcional ao peso usando os valores de referencia por 100g. "
            "Dados do usuário:"
        )

        prompt_text += user_data

        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt_text},
                ],
            }
        ]

        text = processor.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )

        inputs = processor(text=[text], padding=True, return_tensors="pt")

    inputs = inputs.to(model.device)

    with torch.no_grad():
        generated_ids = model.generate(**inputs, max_new_tokens=1024)

    generated_ids_trimmed = [
        out_ids[len(in_ids) :]
        for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
    ]

    output_text = processor.batch_decode(
        generated_ids_trimmed,
        skip_special_tokens=True,
        clean_up_tokenization_spaces=False,
    )

    return output_text[0]

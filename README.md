# Caloric Regression

Project for estimating calories and macronutrients from food images using computer vision and large language models. Project still in production...

## Overview

This project uses a vision-language model (Qwen3-VL-4B-Instruct) to analyze food photographs and estimate the caloric content and macronutrient breakdown of meals. The model identifies visible food items, estimates portion sizes in grams, and returns nutritional information in JSON format.

## How It Works

1. A food image is loaded and preprocessed
2. The image is passed to the Qwen3-VL model along with a structured prompt
3. The model analyzes the image, identifies food items, and estimates portions
4. Nutritional data is calculated using the TACO (Tabela Brasileira de Composição de Alimentos) database as reference
5. Results are returned in JSON format with calories and macronutrients

## Requirements

- Python 3.9+
- PyTorch
- Transformers library
- BitsAndBytes (for 4-bit quantization)
- PIL (Pillow)

## Setup

1. Install dependencies:

```bash
pip install torch transformers bitsandbytes pillow
```

2. The model uses 4-bit quantization via BitsAndBytes to reduce memory requirements, making it possible to run on consumer GPUs.

## Usage

Run the main script to analyze a food image:

```bash
python test.py
```

The script will process the image `pratofeito.jpg` (or modify the path in the code) and output estimated nutritional information in JSON format.

## Data

The `data/` directory contains `taco-db-nutrientes.csv`, which is the Brazilian Food Composition Table (TACO) with nutritional information for hundreds of foods. This database serves as reference for validating and caloring the model's estimations.

## Model Details

- **Model**: Qwen3-VL-4B-Instruct
- **Quantization**: 4-bit NF4 with double quantization
- **Compute dtype**: bfloat16
- **Max output tokens**: 256

## Files

- `test.py` - Main script for food image analysis
- `data/taco-db-nutrientes.csv` - Brazilian Food Composition Database
- `pratofeito.jpg` - Sample food image for testing
- `strogonoff.jpg` - Additional sample image

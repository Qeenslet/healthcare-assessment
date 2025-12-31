# DemoMed Healthcare API – Risk Scoring

This project implements a patient risk scoring system using the DemoMed Healthcare API (fictional), built with **TypeScript (Node.js)**.  
It demonstrates API integration, data validation, and risk calculation under real-world conditions such as pagination, intermittent failures, and inconsistent data.

---

## Features

- Fetches paginated patient data from a REST API
- Handles rate limits and transient server errors with retry logic
- Validates and normalizes inconsistent healthcare data
- Calculates patient risk scores based on provided rules
- Generates alert lists and submits results to the API

---

## Risk Scoring Summary

**Total Risk Score = Blood Pressure + Temperature + Age**

- **High-Risk Patients**: Total score ≥ 4  
- **Fever Patients**: Temperature ≥ 99.6°F  
- **Data Quality Issues**: Invalid or missing BP, temperature, or age

---

## Project Structure

```text
src/
├─ api/           # API client and retry logic
├─ scoring/       # Risk scoring and validation
├─ services/      # Assessment orchestration
├─ types/         # Type definitions
└─ index.ts       # Entry point


## Installation

```
npm install
```

## Create .env file

```
DEMOMED_API_KEY=your-api-key-here
```

## Running the Project

```
npm run dev
```
or
```
yarn dev
```

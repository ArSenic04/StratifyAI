import streamlit as st
import requests
import json
from typing import List, Dict
import time

# Configure the page
st.set_page_config(
    page_title="AI Use Case Generator",
    page_icon="🤖",
    layout="wide"
)

# Constants
API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"
API_KEY = ""

def query_llm(prompt: str) -> str:
    """Query the LLM model with a prompt."""
    headers = {"Authorization": f"Bearer {API_KEY}"}
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 500,
            "temperature": 0.7,
            "top_p": 0.95,
        }
    }
    
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()[0]["generated_text"]

def generate_industry_analysis(company: str) -> str:
    """Generate industry analysis for a company."""
    prompt = f"""Analyze the industry and main focus areas for the company: {company}. 
    Provide a concise overview of their sector and key business areas."""
    return query_llm(prompt)

def generate_use_cases(company: str, industry: str) -> List[Dict]:
    """Generate AI/ML use cases for a company."""
    prompt = f"""Generate 3 innovative AI/ML use cases for {company} in the {industry} industry. 
    For each use case, provide a title, description, and potential business impact.
    Format: Title: [title] Description: [desc] Impact: [impact]"""
    
    response = query_llm(prompt)
    use_cases = []
    
    # Parse the response into structured data
    sections = response.split("\n\n")
    for section in sections:
        if not section.strip():
            continue
            
        title = ""
        description = ""
        impact = ""
        
        for line in section.split("\n"):
            if line.lower().startswith("title:"):
                title = line.split(":", 1)[1].strip()
            elif line.lower().startswith("description:"):
                description = line.split(":", 1)[1].strip()
            elif line.lower().startswith("impact:"):
                impact = line.split(":", 1)[1].strip()
        
        if title and description and impact:
            use_cases.append({
                "title": title,
                "description": description,
                "impact": impact,
                "resources": [
                    f"https://huggingface.co/datasets/search?search={title}",
                    f"https://kaggle.com/search?q={title}"
                ]
            })
    
    return use_cases

def generate_resources(industry: str) -> List[Dict]:
    """Generate relevant resources for an industry."""
    prompt = f"""Suggest 2 relevant industry reports or research papers about AI/ML applications in the {industry} industry.
    Format each as Title: [title]"""
    
    response = query_llm(prompt)
    resources = []
    
    for line in response.split("\n"):
        if line.lower().startswith("title:"):
            title = line.split(":", 1)[1].strip()
            resources.append({
                "title": title,
                "url": f"https://www.google.com/search?q={title}+AI+ML+report"
            })
    
    return resources

# UI Components
st.title("🤖 AI Use Case Generator")
st.subheader("Multi-Agent Market Research System")

# Input section
company_name = st.text_input("Enter company or industry name", key="company_input")

if st.button("Analyze", type="primary"):
    if company_name:
        # Create placeholder for progress
        progress_text = st.empty()
        progress_bar = st.progress(0)
        
        try:
            # Research Agent
            progress_text.text("🔍 Research Agent: Analyzing industry...")
            industry = generate_industry_analysis(company_name)
            progress_bar.progress(33)
            
            # Use Case Generator
            progress_text.text("🧠 Use Case Generator: Identifying opportunities...")
            use_cases = generate_use_cases(company_name, industry)
            progress_bar.progress(66)
            
            # Resource Collector
            progress_text.text("📚 Resource Collector: Gathering resources...")
            resources = generate_resources(industry)
            progress_bar.progress(100)
            
            # Clear progress indicators
            progress_text.empty()
            progress_bar.empty()
            
            # Display results
            st.header("Analysis Results")
            
            # Industry Overview
            st.subheader("Industry Overview")
            st.write(industry)
            
            # Use Cases
            st.subheader("Recommended Use Cases")
            for i, use_case in enumerate(use_cases, 1):
                with st.expander(f"Use Case {i}: {use_case['title']}", expanded=True):
                    st.write("**Description:**", use_case["description"])
                    st.write("**Business Impact:**", use_case["impact"])
                    st.write("**Related Resources:**")
                    for resource in use_case["resources"]:
                        st.markdown(f"- [Dataset]({resource})")
            
            # Additional Resources
            st.subheader("Additional Resources")
            for resource in resources:
                st.markdown(f"- [{resource['title']}]({resource['url']})")
                
        except Exception as e:
            st.error(f"An error occurred: {str(e)}")
    else:
        st.warning("Please enter a company or industry name.")

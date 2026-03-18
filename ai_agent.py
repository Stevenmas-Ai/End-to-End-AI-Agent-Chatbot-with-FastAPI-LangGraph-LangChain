# Step 1: Setup API keys for Groq, OpenAI and Tavily
from dotenv import load_dotenv
import os
load_dotenv()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Step 2: Setup LLM & tools
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from langchain_tavily import TavilySearch
from langchain_core.messages.ai import AIMessage

# Step 3: Setup AI agent with search tool functionality
from langgraph.prebuilt import create_react_agent

system_prompt = "Act as an AI chatbot who is smart and friendly"

def get_response_from_ai_agent(llm_id, query, allow_search, system_prompt, provider):
    # Setup LLM based on provider selected
    if provider == "Groq":
        llm = ChatGroq(model=llm_id)
    elif provider == "OpenAI":
        llm = ChatOpenAI(model=llm_id)

    # Setup tools - enable web search if allow_search is True
    tools = [TavilySearch(max_results=2)] if allow_search else []

    # Create the ReAct agent with LLM, tools and system prompt
    agent = create_react_agent(
        model=llm,
        tools=tools,
        prompt=system_prompt
    )

    # Invoke the agent with the user query
    state = {"messages": query}
    response = agent.invoke(state)

    # Extract only the AI messages from the response
    messages = response.get("messages")
    ai_messages = [message.content for message in messages if isinstance(message, AIMessage)]
    
    # Return the final response
    return ai_messages[-1]

# # Test the agent
# response = get_response_from_ai_agent(
#     llm_id="llama-3.3-70b-versatile",
#     query="Tell me about crypto trends",
#     allow_search=True,
#     system_prompt="Act as a smart and friendly AI chatbot",
#     provider="Groq"
# )
# print(response)
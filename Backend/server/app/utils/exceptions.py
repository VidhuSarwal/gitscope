class GitHubAPIError(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code

class LLMError(Exception):
    def __init__(self, message: str):
        self.message = message

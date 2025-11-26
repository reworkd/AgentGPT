"""نواة الوكيل الأساسية"""

from typing import Dict, Any, Optional
from abc import ABC, abstractmethod
import logging


class BaseAgent(ABC):
    """الفئة الأساسية لجميع الوكلاء"""
    
    def __init__(
        self,
        name: str,
        role: str,
        goal: str,
        backstory: str,
        config: Dict[str, Any]
    ):
        self.name = name
        self.role = role
        self.goal = goal
        self.backstory = backstory
        self.config = config
        self.logger = logging.getLogger(f"Agent.{name}")
        self._setup_llm()
    
    def _setup_llm(self):
        """إعداد النموذج اللغوي"""
        llm_provider = self.config.get("llm_provider", "openai")
        self.llm_config = self.config.get("llm", {})
        
        if llm_provider == "anthropic":
            self.model = "claude-3-opus-20240229"
        elif llm_provider == "google":
            self.model = "gemini-pro"
        else:
            self.model = "gpt-4-turbo-preview"
    
    def execute_task(self, prompt: str, context: Optional[Dict] = None) -> str:
        """تنفيذ مهمة"""
        self.logger.info(f"{self.name} executing task")
        
        # Build full prompt with agent context
        full_prompt = self._build_prompt(prompt, context)
        
        # Execute via LLM (placeholder - integrate with actual LLM)
        result = self._call_llm(full_prompt)
        
        return result
    
    def _build_prompt(self, prompt: str, context: Optional[Dict] = None) -> str:
        """بناء prompt كامل مع سياق الوكيل"""
        system_prompt = f"""
        الاسم: {self.name}
        الدور: {self.role}
        الهدف: {self.goal}
        الخلفية: {self.backstory}
        
        تعليمات:
        - كن محترفاً ومحدداً
        - قدم حلولاً قابلة للتنفيذ
        - راعِ الأهداف التجارية
        - قيّم المخاطر بعناية
        """
        
        if context:
            context_str = "\n".join([f"{k}: {v}" for k, v in context.items()])
            system_prompt += f"\n\nالسياق:\n{context_str}"
        
        return f"{system_prompt}\n\nالمهمة:\n{prompt}"
    
    def _call_llm(self, prompt: str) -> str:
        """استدعاء النموذج اللغوي"""
        # TODO: Implement actual LLM integration
        # For now, return placeholder
        return f"[نتيجة من {self.name}] {prompt[:100]}..."
    
    @abstractmethod
    def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """طريقة التنفيذ الرئيسية - يجب تنفيذها في كل وكيل"""
        pass
"""مُنسق النظام - ينسق بين جميع الوكلاء"""

from typing import Dict, List, Any, Optional
import logging
from .agents import (
    LeaderAgent,
    CoreExecutorAgent,
    ReviewerAgent,
    SpecialistAgent,
    BusinessPlannerAgent,
    MentorAgent
)


class MimoOrchestrator:
    """مُنسق MIMO CLI MAX
    
    يدير تنسيق وتنفيذ المهام عبر فريق الوكلاء
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger("MimoOrchestrator")
        
        # إنشاء الوكلاء
        self.leader = LeaderAgent(config)
        self.core_executor = CoreExecutorAgent(config)
        self.reviewer = ReviewerAgent(config)
        self.specialist = SpecialistAgent(config)
        self.business_planner = BusinessPlannerAgent(config)
        self.mentor = MentorAgent(config)
        
        # تتبع المهام والحالة
        self.project_state = {
            "vision": None,
            "tasks": [],
            "completed_tasks": [],
            "current_phase": "initialization"
        }
    
    def start_project(self, requirements: str) -> Dict[str, Any]:
        """بدء مشروع جديد"""
        self.logger.info("Starting new project")
        
        # المرحلة 1: القائد يحدد الرؤية
        self.logger.info("Phase 1: Vision Definition")
        vision = self.leader.define_vision(requirements)
        self.project_state["vision"] = vision
        
        # المرحلة 2: المخطط يحلل السوق
        self.logger.info("Phase 2: Market Analysis")
        market_analysis = self.business_planner.market_analysis({
            "product_idea": requirements,
            "target_market": vision.get("target_market", "general")
        })
        
        # المرحلة 3: المنتور يقيّم ويعتمد
        self.logger.info("Phase 3: Mentor Evaluation")
        mentor_eval = self.mentor.evaluate_decision({
            "decision": vision,
            "context": market_analysis
        })
        
        if mentor_eval.get("recommendation") != "Approve":
            self.logger.warning("Project needs adjustments")
            return self._request_adjustments(mentor_eval)
        
        # المرحلة 4: تخطيط التنفيذ
        self.logger.info("Phase 4: Execution Planning")
        execution_plan = self._create_execution_plan(vision)
        
        self.project_state["current_phase"] = "execution"
        
        return {
            "status": "project_started",
            "vision": vision,
            "market_analysis": market_analysis,
            "mentor_evaluation": mentor_eval,
            "execution_plan": execution_plan
        }
    
    def execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """تنفيذ مهمة"""
        task_type = task.get("type")
        self.logger.info(f"Executing task: {task_type}")
        
        # المنفذ ينفذ
        result = self.core_executor.execute(task)
        
        # المراجع يراجع
        review = self.reviewer.review_code({
            "code": result.get("code", ""),
            "context": task
        })
        
        # إن لم يُعتمد، المنتور يحكم
        if not review.get("approved"):
            conflict_resolution = self.mentor.resolve_conflict({
                "agents": ["المنفذ", "المراجع"],
                "details": f"Code not approved. Issues: {review.get('issues')}"
            })
            
            # إن حكم بال refactor
            if "refactor" in conflict_resolution.get("recommended_approach", "").lower():
                refactor_plan = self.reviewer.create_refactor_plan({
                    "code": result.get("code", ""),
                    "issues": review.get("issues", [])
                })
                return {
                    "status": "needs_refactor",
                    "result": result,
                    "review": review,
                    "refactor_plan": refactor_plan
                }
        
        # إن تم اعتماده
        self.project_state["completed_tasks"].append(task)
        
        return {
            "status": "completed",
            "result": result,
            "review": review
        }
    
    def setup_infrastructure(self) -> Dict[str, Any]:
        """إعداد البنية التحتية"""
        self.logger.info("Setting up infrastructure")
        
        # المتخصص يبني البنية
        infrastructure = self.specialist.setup_infrastructure({
            "requirements": self.project_state.get("vision")
        })
        
        # CI/CD
        cicd = self.specialist.configure_cicd({
            "platform": "github-actions"
        })
        
        # Security Audit
        security = self.specialist.security_audit({
            "project_path": "./"
        })
        
        return {
            "infrastructure": infrastructure,
            "cicd": cicd,
            "security": security
        }
    
    def create_landing_page(self) -> Dict[str, Any]:
        """إنشاء صفحة هبوط"""
        self.logger.info("Creating landing page")
        
        vision = self.project_state.get("vision")
        
        landing_page = self.business_planner.create_landing_page({
            "value_proposition": vision.get("value_proposition", ""),
            "target_audience": vision.get("target_audience", "")
        })
        
        # المراجع يراجع الكود
        review = self.reviewer.review_code({
            "code": landing_page.get("code", ""),
            "context": {"type": "landing_page"}
        })
        
        return {
            "landing_page": landing_page,
            "review": review
        }
    
    def get_status(self) -> Dict[str, Any]:
        """الحصول على حالة المشروع"""
        return {
            "phase": self.project_state["current_phase"],
            "vision": self.project_state.get("vision"),
            "total_tasks": len(self.project_state["tasks"]),
            "completed_tasks": len(self.project_state["completed_tasks"]),
            "progress": self._calculate_progress()
        }
    
    def _create_execution_plan(self, vision: Dict[str, Any]) -> List[Dict[str, Any]]:
        """إنشاء خطة التنفيذ"""
        # TODO: Implement detailed plan creation
        return [
            {"phase": "infrastructure", "estimated_days": 2},
            {"phase": "frontend", "estimated_days": 5},
            {"phase": "backend", "estimated_days": 5},
            {"phase": "testing", "estimated_days": 2},
            {"phase": "deployment", "estimated_days": 1}
        ]
    
    def _request_adjustments(self, evaluation: Dict[str, Any]) -> Dict[str, Any]:
        """طلب تعديلات"""
        return {
            "status": "needs_adjustments",
            "evaluation": evaluation,
            "message": "يجب إجراء تعديلات بناءً على توصيات المنتور"
        }
    
    def _calculate_progress(self) -> float:
        """حساب نسبة الإنجاز"""
        total = len(self.project_state["tasks"])
        if total == 0:
            return 0.0
        completed = len(self.project_state["completed_tasks"])
        return (completed / total) * 100
#!/usr/bin/env python3
"""واجهة سطر الأوامر لـ MIMO CLI MAX"""

import argparse
import json
import logging
from typing import Dict, Any
from .orchestrator import MimoOrchestrator


class MimoCLI:
    """واجهة سطر الأوامر"""
    
    def __init__(self):
        self.orchestrator = None
        self._setup_logging()
    
    def _setup_logging(self):
        """إعداد السجلات"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    
    def run(self, args: argparse.Namespace):
        """تنفيذ الأمر"""
        command = args.command
        
        if command == "init":
            self._init_project(args)
        elif command == "start":
            self._start_project(args)
        elif command == "task":
            self._execute_task(args)
        elif command == "infrastructure":
            self._setup_infrastructure(args)
        elif command == "landing":
            self._create_landing_page(args)
        elif command == "status":
            self._get_status(args)
        else:
            print(f"Unknown command: {command}")
    
    def _init_project(self, args: argparse.Namespace):
        """تهيئة مشروع جديد"""
        config = self._load_config(args.config)
        self.orchestrator = MimoOrchestrator(config)
        print("✅ Project initialized successfully")
    
    def _start_project(self, args: argparse.Namespace):
        """بدء مشروع"""
        if not self.orchestrator:
            self._init_project(args)
        
        requirements = args.requirements
        if args.requirements_file:
            with open(args.requirements_file, 'r') as f:
                requirements = f.read()
        
        print(f"\n🚀 Starting project with requirements:\n{requirements}\n")
        
        result = self.orchestrator.start_project(requirements)
        
        print("\n" + "="*60)
        print("🎯 PROJECT VISION")
        print("="*60)
        print(json.dumps(result.get("vision"), indent=2))
        
        print("\n" + "="*60)
        print("📊 MARKET ANALYSIS")
        print("="*60)
        print(json.dumps(result.get("market_analysis"), indent=2))
        
        print("\n" + "="*60)
        print("🧑‍🏫 MENTOR EVALUATION")
        print("="*60)
        print(json.dumps(result.get("mentor_evaluation"), indent=2))
        
        print("\n✅ Project started successfully!\n")
    
    def _execute_task(self, args: argparse.Namespace):
        """تنفيذ مهمة"""
        if not self.orchestrator:
            print("❌ Error: Project not initialized. Run 'mimo init' first.")
            return
        
        task = {
            "type": args.task_type,
            "requirements": args.requirements,
            "tech_stack": args.tech_stack.split(",") if args.tech_stack else []
        }
        
        print(f"\n⏳ Executing {args.task_type} task...\n")
        
        result = self.orchestrator.execute_task(task)
        
        print("\n" + "="*60)
        print("📝 TASK RESULT")
        print("="*60)
        print(json.dumps(result, indent=2))
        
        if result.get("status") == "completed":
            print("\n✅ Task completed successfully!\n")
        elif result.get("status") == "needs_refactor":
            print("\n⚠️ Task needs refactoring. Check the plan above.\n")
    
    def _setup_infrastructure(self, args: argparse.Namespace):
        """إعداد البنية التحتية"""
        if not self.orchestrator:
            print("❌ Error: Project not initialized. Run 'mimo init' first.")
            return
        
        print("\n🛠️ Setting up infrastructure...\n")
        
        result = self.orchestrator.setup_infrastructure()
        
        print("\n" + "="*60)
        print("📦 INFRASTRUCTURE")
        print("="*60)
        print(json.dumps(result, indent=2))
        
        print("\n✅ Infrastructure setup completed!\n")
    
    def _create_landing_page(self, args: argparse.Namespace):
        """إنشاء صفحة هبوط"""
        if not self.orchestrator:
            print("❌ Error: Project not initialized. Run 'mimo init' first.")
            return
        
        print("\n🌐 Creating landing page...\n")
        
        result = self.orchestrator.create_landing_page()
        
        print("\n" + "="*60)
        print("💻 LANDING PAGE")
        print("="*60)
        print(json.dumps(result, indent=2))
        
        print("\n✅ Landing page created!\n")
    
    def _get_status(self, args: argparse.Namespace):
        """الحصول على حالة المشروع"""
        if not self.orchestrator:
            print("❌ Error: Project not initialized. Run 'mimo init' first.")
            return
        
        status = self.orchestrator.get_status()
        
        print("\n" + "="*60)
        print("📊 PROJECT STATUS")
        print("="*60)
        print(json.dumps(status, indent=2))
        print()
    
    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """تحميل الإعدادات"""
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Default configuration
            return {
                "llm_provider": "openai",
                "llm": {
                    "model": "gpt-4-turbo-preview",
                    "temperature": 0.7
                },
                "max_lines_per_file": 1500,
                "productivity_multiplier": 10
            }


def main():
    """الدالة الرئيسية"""
    parser = argparse.ArgumentParser(
        description="MIMO CLI MAX - نظام برمجة متكامل ذاتي القيادة"
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Init command
    init_parser = subparsers.add_parser("init", help="Initialize a new project")
    init_parser.add_argument("--config", default="mimo.config.json", help="Config file path")
    
    # Start command
    start_parser = subparsers.add_parser("start", help="Start a new project")
    start_parser.add_argument("--requirements", help="Project requirements")
    start_parser.add_argument("--requirements-file", help="Requirements file path")
    start_parser.add_argument("--config", default="mimo.config.json")
    
    # Task command
    task_parser = subparsers.add_parser("task", help="Execute a task")
    task_parser.add_argument("task_type", choices=["generate_code", "implement_feature", "create_component"])
    task_parser.add_argument("--requirements", required=True)
    task_parser.add_argument("--tech-stack")
    
    # Infrastructure command
    infra_parser = subparsers.add_parser("infrastructure", help="Setup infrastructure")
    
    # Landing page command
    landing_parser = subparsers.add_parser("landing", help="Create landing page")
    
    # Status command
    status_parser = subparsers.add_parser("status", help="Get project status")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    cli = MimoCLI()
    cli.run(args)


if __name__ == "__main__":
    main()
import unittest
from agentgpt.arg_tools import parse_arguments, handle_arguments

class TestArgTools(unittest.TestCase):

    def test_parse_arguments_with_task(self):
        args = parse_arguments(['--task', 'test_task'])
        self.assertEqual(args.task, 'test_task')
        self.assertIsNone(args.config)

    def test_parse_arguments_with_config(self):
        args = parse_arguments(['--config', 'test_config'])
        self.assertEqual(args.config, 'test_config')
        self.assertIsNone(args.task)

    def test_handle_arguments_with_task(self):
        args = parse_arguments(['--task', 'test_task'])
        with self.assertLogs(level='INFO') as log:
            handle_arguments(args)
            self.assertIn('Performing task: test_task', log.output)

    def test_handle_arguments_with_config(self):
        args = parse_arguments(['--config', 'test_config'])
        with self.assertLogs(level='INFO') as log:
            handle_arguments(args)
            self.assertIn('Using configuration file: test_config', log.output)

    def test_parse_arguments_with_no_args(self):
        args = parse_arguments([])
        self.assertIsNone(args.task)
        self.assertIsNone(args.config)

if __name__ == '__main__':
    unittest.main()

import argparse
import os

from pydantic import BaseModel
from pydantic_yaml import parse_yaml_raw_as
from numpy.random import choice


class Tasks(BaseModel):
    tasks: list[str]


def select_from(filepath: str):
    if not os.path.isabs(filepath):
        filepath = os.path.join(os.path.dirname(__file__), filepath)

    with open(filepath, 'r') as file:
        # content = yaml.safe_load(file)
        tasks_obj = parse_yaml_raw_as(Tasks, file)
        tasks = tasks_obj.tasks

    weights = [2.0 ** -k for k in range(len(tasks))]
    scaled_weights = [w / sum(weights) for w in weights]
    # print(scaled_weights)
    _selected_task = choice(tasks, p=scaled_weights)
    return _selected_task


if __name__ == '__main__':
    """
    Example usage:
    python helper_scripts/selector.py -f mean.yml
    """
    # TODO: support for nested items
    parser = argparse.ArgumentParser(
        description="Choose a random task from a YAML file"
    )
    parser.add_argument(
        "-f", "--filepath", nargs='?',
        type=str, help="Path to the YAML file containing tasks.",
        default='tasks.example.yml'
    )
    args = parser.parse_args()

    selected_task = select_from(args.filepath)
    print(selected_task)

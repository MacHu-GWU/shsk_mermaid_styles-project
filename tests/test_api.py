# -*- coding: utf-8 -*-

from shsk_mermaid_styles import api


def test():
    _ = api


if __name__ == "__main__":
    from shsk_mermaid_styles.tests import run_cov_test

    run_cov_test(
        __file__,
        "shsk_mermaid_styles.api",
        preview=False,
    )

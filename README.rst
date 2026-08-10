
.. .. image:: https://readthedocs.org/projects/shsk-mermaid-styles/badge/?version=latest
    :target: https://shsk-mermaid-styles.readthedocs.io/en/latest/
    :alt: Documentation Status

.. .. image:: https://github.com/MacHu-GWU/shsk_mermaid_styles-project/actions/workflows/main.yml/badge.svg
    :target: https://github.com/MacHu-GWU/shsk_mermaid_styles-project/actions?query=workflow:CI

.. .. image:: https://codecov.io/gh/MacHu-GWU/shsk_mermaid_styles-project/branch/main/graph/badge.svg
    :target: https://codecov.io/gh/MacHu-GWU/shsk_mermaid_styles-project

.. .. image:: https://img.shields.io/pypi/v/shsk-mermaid-styles.svg
    :target: https://pypi.python.org/pypi/shsk-mermaid-styles

.. .. image:: https://img.shields.io/pypi/l/shsk-mermaid-styles.svg
    :target: https://pypi.python.org/pypi/shsk-mermaid-styles

.. .. image:: https://img.shields.io/pypi/pyversions/shsk-mermaid-styles.svg
    :target: https://pypi.python.org/pypi/shsk-mermaid-styles

.. image:: https://img.shields.io/badge/✍️_Release_History!--None.svg?style=social&logo=github
    :target: https://github.com/MacHu-GWU/shsk_mermaid_styles-project/blob/main/release-history.rst

.. image:: https://img.shields.io/badge/⭐_Star_me_on_GitHub!--None.svg?style=social&logo=github
    :target: https://github.com/MacHu-GWU/shsk_mermaid_styles-project

------

.. .. image:: https://img.shields.io/badge/Link-API-blue.svg
    :target: https://shsk-mermaid-styles.readthedocs.io/en/latest/py-modindex.html

.. .. image:: https://img.shields.io/badge/Link-Install-blue.svg
    :target: `install`_

.. image:: https://img.shields.io/badge/Link-GitHub-blue.svg
    :target: https://github.com/MacHu-GWU/shsk_mermaid_styles-project

.. image:: https://img.shields.io/badge/Link-Submit_Issue-blue.svg
    :target: https://github.com/MacHu-GWU/shsk_mermaid_styles-project/issues

.. image:: https://img.shields.io/badge/Link-Request_Feature-blue.svg
    :target: https://github.com/MacHu-GWU/shsk_mermaid_styles-project/issues

.. image:: https://img.shields.io/badge/Link-Download-blue.svg
    :target: https://pypi.org/pypi/shsk-mermaid-styles#files


Welcome to ``shsk_mermaid_styles`` Documentation
==============================================================================
.. .. image:: https://shsk-mermaid-styles.readthedocs.io/en/latest/_static/shsk_mermaid_styles-logo.png
    :target: https://shsk-mermaid-styles.readthedocs.io/en/latest/

This is my personal Mermaid visual style guide, shipped as the ``mermaid-styles``
Claude Code plugin. It is not a Mermaid syntax reference. It is a **closed
library of canonical diagram patterns**: thirteen recognized shapes of thought,
each one locking down its own node shapes, flow direction, arrow semantics,
color classes, and complexity limits before a single line of Mermaid gets
written. An agent drawing a diagram picks the one pattern that matches the
structure of the content, then follows that pattern's file literally. Nothing is
left to taste, which is the point: across a body of tutorials, explainers, blog
posts, and design docs, every diagram reads as one recognizable system rather
than a pile of generic boxes and arrows.

The spec lives entirely in ``.claude/skills/mermaid-styles/``. Each pattern file
is self-contained, carrying its own syntax, literal hex colors, copyable
canonical examples, and annotated bad ones, so an agent loads exactly one file
to draw one diagram. The Python package in this repository is only supporting
tooling; the deliverable is the plugin.

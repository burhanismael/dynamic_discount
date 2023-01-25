# -*- coding: utf-8 -*-
{
    "name": "POS Global Discount in Amount and Percentage",

    "summary": """Apply discount amount in percentage and amount for global discount in POS""",

    "description": """
        Apply discount amount in percentage and amount for global discount in POS
    """,

    "author": "Axiom Team",
    "website": "https://axiomworld.net",
    "category": "Point of Sale",
    "version": "15.0.1.0.1",
    "depends": ["pos_discount"],
    "installable": True,
    "auto_install": False,
    "data": [
        # "views/pos_config.xml",
    ],
    'assets': {
        'point_of_sale.assets': [
            '/dynamic_discount/static/src/js/custom_discount.js',
        ],
    },
    'images': ['static/description/icon.png'],
}

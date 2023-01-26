odoo.define('custom.DiscountButton', function(require) {
    'use strict';

    const CustomDiscountButton = require('pos_discount.DiscountButton');
    const Registries = require('point_of_sale.Registries');

    const AmountDiscountButton = (CustomDiscountButton) =>
        class extends CustomDiscountButton {

            async discountPopup(discount_type) {
                var self = this;

                const { confirmed, payload } = await this.showPopup('NumberPopup',{
                    title: this.env._t('Discount'),
                    startingValue: this.env.pos.config.discount_pc,
                    isInputSelected: true
                });
                if (confirmed) {
                    await self.apply_discount(Number(payload), discount_type);
                }

            }

            async onClick() {

                var discount_type = false;


                    const { confirmed } = await this.showPopup('ConfirmPopup', {
                        title: this.env._t('Select Discount Type'),
                        body: this.env._t(
                            'Please select the type of global discount to be applied'
                        ),
                        confirmText: this.env._t('Percentage'),
                        cancelText: this.env._t('Amount'),
                    });
                    if (confirmed) {
                        discount_type = 'percentage';
                    }
                    else {
                        discount_type = 'amount';
                    }


                await this.discountPopup(discount_type);
            }

            async apply_discount(pc, discount_type) {
                var order    = this.env.pos.get_order();
                var lines    = order.get_orderlines();
                var product  = this.env.pos.db.get_product_by_id(this.env.pos.config.discount_product_id[0]);
                if (product === undefined) {
                    await this.showPopup('ErrorPopup', {
                        title : this.env._t("No discount product found"),
                        body  : this.env._t("The discount product seems misconfigured. Make sure it is flagged as 'Can be Sold' and 'Available in Point of Sale'."),
                    });
                    return;
                }

                // Remove existing discounts
                var i = 0;
                while ( i < lines.length ) {
                    if (lines[i].get_product() === product) {
                        order.remove_orderline(lines[i]);
                    } else {
                        i++;
                    }
                }

                // Add discount
                var discount = 0.0;
                // Check the type of discount selected
                if (discount_type === 'percentage') {
                debugger;
                    // We add the price as manually set to avoid recomputation when changing customer.
                    var base_to_discount = order.get_total_without_tax();
                    if (product.taxes_id.length){
                        var first_tax = this.env.pos.taxes_by_id[product.taxes_id[0]];
                        if (first_tax.price_include) {
                            base_to_discount = order.get_total_with_tax();
                        }
                    }
                    discount = - pc / 100.0 * base_to_discount;
                } else {
                debugger;
                    discount = - pc;
                }

                if( discount < 0 ){
                    order.add_product(product, {
                        price: discount,
                        lst_price: discount,
                        extras: {
                            price_manually_set: true,
                        },
                    });
                }
            }
        };

    Registries.Component.extend(CustomDiscountButton, AmountDiscountButton);
    return CustomDiscountButton;

});
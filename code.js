// =====================================================
// DOM ELEMENTS
// =====================================================

const standsContainer =
    document.getElementById(
        "stands-container"
    );

const printButton =
    document.getElementById(
        "print-button"
    );

const printArea =
    document.getElementById(
        "print-area"
    );

const clientNameInput =
    document.getElementById(
        "client-name"
    );

const clientAddressInput =
    document.getElementById(
        "client-address"
    );

const selectedOnlyButton =
    document.getElementById(
        "selected-only-button"
    );

const newOrderButton =
    document.getElementById(
        "new-order-button"
    );

const orderSummaryContent =
    document.getElementById(
        "order-summary-content"
    );

let selectedOnlyMode =
    false;


// =====================================================
// START APPLICATION
// =====================================================

renderStands();

renderOtherProducts();

updateOrderSummary();


// =====================================================
// RENDER ALL STANDS
// =====================================================

function renderStands() {

    standsContainer.innerHTML =
        "";

    stands.forEach(stand => {

        const standElement =
            createStandElement(
                stand
            );

        standsContainer.appendChild(
            standElement
        );

    });

}


// =====================================================
// CREATE ONE DISPLAY STAND
// =====================================================

function createStandElement(
    stand
) {

    // =================================================
    // MAIN ACCORDION
    // =================================================

    const accordion =
        document.createElement(
            "div"
        );

    accordion.className =
        "accordion";

    accordion.dataset.standId =
        stand.id;


    // =================================================
    // HEADER
    // =================================================

    const header =
        document.createElement(
            "div"
        );

    header.className =
        "accordion-header";


    // =================================================
    // HEADER LEFT
    // =================================================

    const headerLeft =
        document.createElement(
            "div"
        );

    headerLeft.className =
        "header-left";


    // Checkbox

    const checkbox =
        document.createElement(
            "input"
        );

    checkbox.type =
        "checkbox";

    checkbox.checked =
        false;


    // Stand name

    const standName =
        createBilingualName(
            "stand-name",
            stand.chinese,
            stand.spanish
        );

    headerLeft.appendChild(
        checkbox
    );

    headerLeft.appendChild(
        standName
    );


    // =================================================
    // HEADER RIGHT
    // =================================================

    const headerRight =
        document.createElement(
            "div"
        );

    headerRight.className =
        "header-right";


    // Quantity

    const quantity =
        document.createElement(
            "input"
        );

    quantity.type =
        "number";

    quantity.className =
        "quantity";

    quantity.value =
        0;

    quantity.min =
        0;


    // Arrow

    const arrow =
        document.createElement(
            "span"
        );

    arrow.className =
        "accordion-arrow";

    arrow.textContent =
        "▼";

    headerRight.appendChild(
        quantity
    );

    headerRight.appendChild(
        arrow
    );

    header.appendChild(
        headerLeft
    );

    header.appendChild(
        headerRight
    );


    // =================================================
    // MAIN CONTENT
    // =================================================

    const content =
        document.createElement(
            "div"
        );

    content.className =
        "accordion-content";

    content.style.display =
        "none";


    // =================================================
    // COMPONENT SECTION
    // =================================================

    const componentsSection =
        document.createElement(
            "div"
        );

    componentsSection.className =
        "components";

    const componentsTitle =
        document.createElement(
            "div"
        );

    componentsTitle.className =
        "section-title";

    componentsTitle.textContent =
        "Componentes / 配件";

    componentsSection.appendChild(
        componentsTitle
    );

    const componentList =
        document.createElement(
            "ul"
        );

    stand.components.forEach(
        component => {

            componentList.appendChild(
                createComponentElement(
                    component
                )
            );

        }
    );

    componentsSection.appendChild(
        componentList
    );

    content.appendChild(
        componentsSection
    );


    // =================================================
    // ADDONS
    // =================================================

    if (
        stand.addons &&
        stand.addons.length > 0
    ) {

        const addonsSection =
            document.createElement(
                "div"
            );

        addonsSection.className =
            "addons";

        const addonsTitle =
            document.createElement(
                "div"
            );

        addonsTitle.className =
            "section-title";

        addonsTitle.textContent =
            "Extras / 另外加";

        addonsSection.appendChild(
            addonsTitle
        );

        stand.addons.forEach(
            addon => {

                const addonElement =
                    createAddonElement(
                        addon
                    );

                addonsSection.appendChild(
                    addonElement
                );

            }
        );

        content.appendChild(
            addonsSection
        );

    }


    // =================================================
    // BUILD ACCORDION
    // =================================================

    accordion.appendChild(
        header
    );

    accordion.appendChild(
        content
    );


    // =================================================
    // MAIN ACCORDION CLICK
    // =================================================

    header.addEventListener(
        "click",
        event => {

            if (
                event.target.matches(
                    'input[type="checkbox"]'
                ) ||
                event.target.matches(
                    'input[type="number"]'
                )
            ) {

                return;

            }

            toggleAccordion(
                content,
                arrow
            );

        }
    );


    // =================================================
    // MAIN QUANTITY
    // =================================================

    quantity.addEventListener(
        "input",
        () => {

            const amount =
                sanitizeQuantity(
                    quantity.value
                );

            quantity.value =
                amount;

            checkbox.checked =
                amount > 0;

            updateOrderSummary();

            if (
                selectedOnlyMode
            ) {

                applySelectedOnlyFilter();

            }

        }
    );


    // =================================================
    // MAIN CHECKBOX
    // =================================================

    checkbox.addEventListener(
        "change",
        () => {

            // =============================================
            // UNCHECKED
            // =============================================

            if (
                !checkbox.checked
            ) {

                quantity.value =
                    0;

                accordion
                    .querySelectorAll(
                        ".addon-quantity"
                    )
                    .forEach(
                        input => {

                            input.value =
                                0;

                            const addonAccordion =
                                input.closest(
                                    ".addon-accordion"
                                );

                            if (
                                addonAccordion
                            ) {

                                addonAccordion
                                    .classList
                                    .remove(
                                        "active"
                                    );

                            }

                        }
                    );

            }

            // =============================================
            // CHECKED
            // =============================================

            else if (
                sanitizeQuantity(
                    quantity.value
                ) === 0
            ) {

                quantity.value =
                    1;

            }

            updateOrderSummary();

            if (
                selectedOnlyMode
            ) {

                applySelectedOnlyFilter();

            }

        }
    );

    return accordion;

}


// =====================================================
// CREATE BILINGUAL NAME
// =====================================================

function createBilingualName(
    className,
    chineseText,
    spanishText
) {

    const name =
        document.createElement(
            "div"
        );

    name.className =
        className;

    const chinese =
        document.createElement(
            "span"
        );

    chinese.className =
        "chinese";

    chinese.textContent =
        chineseText;

    const spanish =
        document.createElement(
            "span"
        );

    spanish.className =
        "spanish";

    spanish.textContent =
        spanishText;

    name.appendChild(
        chinese
    );

    name.appendChild(
        spanish
    );

    return name;

}


// =====================================================
// CREATE COMPONENT ROW
// =====================================================

function createComponentElement(
    component
) {

    const item =
        document.createElement(
            "li"
        );

    item.className =
        "component";

    item.dataset.quantity =
        component.quantity;

    const name =
        createBilingualName(
            "component-name",
            component.chinese,
            component.spanish
        );

    const amount =
        document.createElement(
            "span"
        );

    amount.className =
        "component-amount";

    amount.textContent =
        "× " +
        component.quantity;

    item.appendChild(
        name
    );

    item.appendChild(
        amount
    );

    return item;

}


// =====================================================
// CREATE ONE ADDON
// =====================================================

function createAddonElement(
    addon
) {

    const accordion =
        document.createElement(
            "div"
        );

    accordion.className =
        "addon-accordion";

    accordion.dataset.addonId =
        addon.id;


    // =================================================
    // HEADER
    // =================================================

    const header =
        document.createElement(
            "div"
        );

    header.className =
        "addon-header";

    const addonName =
        createBilingualName(
            "addon-name",
            addon.chinese,
            addon.spanish
        );

    const headerRight =
        document.createElement(
            "div"
        );

    headerRight.className =
        "addon-header-right";

    const quantity =
        document.createElement(
            "input"
        );

    quantity.type =
        "number";

    quantity.className =
        "addon-quantity";

    quantity.value =
        0;

    quantity.min =
        0;

    const arrow =
        document.createElement(
            "span"
        );

    arrow.className =
        "addon-arrow";

    arrow.textContent =
        "▼";

    headerRight.appendChild(
        quantity
    );

    headerRight.appendChild(
        arrow
    );

    header.appendChild(
        addonName
    );

    header.appendChild(
        headerRight
    );


    // =================================================
    // CONTENT
    // =================================================

    const content =
        document.createElement(
            "div"
        );

    content.className =
        "addon-content";

    content.style.display =
        "none";

    const componentList =
        document.createElement(
            "ul"
        );

    addon.components.forEach(
        component => {

            componentList.appendChild(
                createComponentElement(
                    component
                )
            );

        }
    );

    content.appendChild(
        componentList
    );


    // =================================================
    // ADDON CLICK
    // =================================================

    header.addEventListener(
        "click",
        event => {

            if (
                event.target.matches(
                    'input[type="number"]'
                )
            ) {

                return;

            }

            toggleAccordion(
                content,
                arrow
            );

        }
    );


    // =================================================
    // ADDON QUANTITY
    // =================================================

    quantity.addEventListener(
        "input",
        () => {

            const amount =
                sanitizeQuantity(
                    quantity.value
                );

            quantity.value =
                amount;


            // =============================================
            // GREEN ADDON
            // =============================================

            accordion.classList.toggle(
                "active",
                amount > 0
            );


            // =============================================
            // ACTIVATE PARENT STAND
            // =============================================

            if (
                amount > 0
            ) {

                const parentStand =
                    accordion.closest(
                        ".accordion"
                    );

                const standCheckbox =
                    parentStand.querySelector(
                        '.accordion-header input[type="checkbox"]'
                    );

                const standQuantity =
                    parentStand.querySelector(
                        ".accordion-header .quantity"
                    );

                standCheckbox.checked =
                    true;

                if (
                    sanitizeQuantity(
                        standQuantity.value
                    ) === 0
                ) {

                    standQuantity.value =
                        1;

                }

            }

            updateOrderSummary();

            if (
                selectedOnlyMode
            ) {

                applySelectedOnlyFilter();

            }

        }
    );


    // =================================================
    // BUILD
    // =================================================

    accordion.appendChild(
        header
    );

    accordion.appendChild(
        content
    );

    return accordion;

}


// =====================================================
// RENDER OTHER PRODUCTS
// =====================================================

function renderOtherProducts() {

    const accordion =
        document.createElement(
            "div"
        );

    accordion.className =
        "other-products-accordion";


    // =================================================
    // HEADER
    // =================================================

    const header =
        document.createElement(
            "div"
        );

    header.className =
        "other-products-header";

    const name =
        createBilingualName(
            "other-products-name",
            "其他产品",
            "Otros Productos"
        );

    const arrow =
        document.createElement(
            "span"
        );

    arrow.className =
        "other-products-arrow";

    arrow.textContent =
        "▼";

    header.appendChild(
        name
    );

    header.appendChild(
        arrow
    );


    // =================================================
    // CONTENT
    // =================================================

    const content =
        document.createElement(
            "div"
        );

    content.className =
        "other-products-content";

    content.style.display =
        "none";


    // =================================================
    // PRODUCTS
    // =================================================

    otherProducts.forEach(
        product => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "other-product-row";

            // Smooth transition when turning green
            row.style.transition =
                "background-color 0.2s ease";

            const productName =
                createBilingualName(
                    "other-product-name",
                    product.chinese,
                    product.spanish
                );

            const quantity =
                document.createElement(
                    "input"
                );

            quantity.type =
                "number";

            quantity.className =
                "other-product-quantity";

            quantity.value =
                0;

            quantity.min =
                0;

            quantity.addEventListener(
                "input",
                () => {

                    quantity.value =
                        sanitizeQuantity(
                            quantity.value
                        );

                    updateOtherProductsStatus(
                        accordion
                    );

                    updateOrderSummary();

                    if (
                        selectedOnlyMode
                    ) {

                        applySelectedOnlyFilter();

                    }

                }
            );

            row.appendChild(
                productName
            );

            row.appendChild(
                quantity
            );

            content.appendChild(
                row
            );

        }
    );


    // =================================================
    // OPEN / CLOSE
    // =================================================

    header.addEventListener(
        "click",
        () => {

            toggleAccordion(
                content,
                arrow
            );

        }
    );

    accordion.appendChild(
        header
    );

    accordion.appendChild(
        content
    );

    standsContainer.appendChild(
        accordion
    );

}


// =====================================================
// OTHER PRODUCTS ACTIVE STATUS
// =====================================================

function updateOtherProductsStatus(
    accordion
) {

    const quantities =
        accordion.querySelectorAll(
            ".other-product-quantity"
        );

    let hasProducts =
        false;

    quantities.forEach(
        input => {

            const quantity =
                sanitizeQuantity(
                    input.value
                );

            const row =
                input.closest(
                    ".other-product-row"
                );


            // =================================================
            // GREEN INDIVIDUAL SELECTED PRODUCT
            // =================================================

            if (
                row
            ) {

                if (
                    quantity > 0
                ) {

                    row.style.backgroundColor =
                        "#294a35";

                    row.style.borderRadius =
                        "5px";

                }

                else {

                    row.style.backgroundColor =
                        "";

                    row.style.borderRadius =
                        "";

                }

            }


            // =================================================
            // CHECK IF ANY PRODUCT IS SELECTED
            // =================================================

            if (
                quantity > 0
            ) {

                hasProducts =
                    true;

            }

        }
    );


    // =================================================
    // GREEN OTHER PRODUCTS MAIN HEADER
    // =================================================

    accordion.classList.toggle(
        "active",
        hasProducts
    );

}


// =====================================================
// TOGGLE ACCORDION
// =====================================================

function toggleAccordion(
    content,
    arrow
) {

    const isClosed =
        content.style.display ===
        "none";

    if (
        isClosed
    ) {

        content.style.display =
            "block";

        arrow.style.transform =
            "rotate(0deg)";

    }

    else {

        content.style.display =
            "none";

        arrow.style.transform =
            "rotate(-90deg)";

    }

}


// =====================================================
// SANITIZE QUANTITY
// =====================================================

function sanitizeQuantity(
    value
) {

    let amount =
        parseInt(
            value
        ) || 0;

    if (
        amount < 0
    ) {

        amount =
            0;

    }

    return amount;

}


// =====================================================
// SELECTED ONLY BUTTON
// =====================================================

selectedOnlyButton.addEventListener(
    "click",
    () => {

        selectedOnlyMode =
            !selectedOnlyMode;

        selectedOnlyButton.classList.toggle(
            "active",
            selectedOnlyMode
        );

        if (
            selectedOnlyMode
        ) {

            selectedOnlyButton.textContent =
                "Mostrar todos / 显示全部";

        }

        else {

            selectedOnlyButton.textContent =
                "Mostrar seleccionados / 仅显示已选";

        }

        applySelectedOnlyFilter();

    }
);


// =====================================================
// APPLY SELECTED ONLY FILTER
// =====================================================

function applySelectedOnlyFilter() {

    // =================================================
    // STANDS
    // =================================================

    const standAccordions =
        standsContainer.querySelectorAll(
            ".accordion"
        );

    standAccordions.forEach(
        accordion => {

            const checkbox =
                accordion.querySelector(
                    '.accordion-header input[type="checkbox"]'
                );

            const quantity =
                accordion.querySelector(
                    ".accordion-header .quantity"
                );

            const selected =
                checkbox.checked &&
                sanitizeQuantity(
                    quantity.value
                ) > 0;

            accordion.classList.toggle(
                "filtered-hidden",
                selectedOnlyMode &&
                !selected
            );

        }
    );


    // =================================================
    // OTHER PRODUCTS
    // =================================================

    const otherAccordion =
        standsContainer.querySelector(
            ".other-products-accordion"
        );

    if (
        !otherAccordion
    ) {

        return;

    }

    const productRows =
        otherAccordion.querySelectorAll(
            ".other-product-row"
        );

    let hasSelectedProducts =
        false;

    productRows.forEach(
        row => {

            const quantity =
                row.querySelector(
                    ".other-product-quantity"
                );

            const selected =
                sanitizeQuantity(
                    quantity.value
                ) > 0;

            if (
                selected
            ) {

                hasSelectedProducts =
                    true;

            }

            row.classList.toggle(
                "filtered-hidden",
                selectedOnlyMode &&
                !selected
            );

        }
    );

    otherAccordion.classList.toggle(
        "filtered-hidden",
        selectedOnlyMode &&
        !hasSelectedProducts
    );

}


// =====================================================
// UPDATE ORDER SUMMARY
// =====================================================

function updateOrderSummary() {

    orderSummaryContent.innerHTML =
        "";

    const selectedStands =
        [];

    let totalStandUnits =
        0;


    // =================================================
    // SELECTED STANDS
    // =================================================

    standsContainer
        .querySelectorAll(
            ".accordion"
        )
        .forEach(
            accordion => {

                const checkbox =
                    accordion.querySelector(
                        '.accordion-header input[type="checkbox"]'
                    );

                const quantityInput =
                    accordion.querySelector(
                        ".accordion-header .quantity"
                    );

                const quantity =
                    sanitizeQuantity(
                        quantityInput.value
                    );

                if (
                    !checkbox.checked ||
                    quantity <= 0
                ) {

                    return;

                }

                const chinese =
                    accordion.querySelector(
                        ".stand-name .chinese"
                    )
                    .textContent
                    .trim();

                const spanish =
                    accordion.querySelector(
                        ".stand-name .spanish"
                    )
                    .textContent
                    .trim();

                selectedStands.push({

                    chinese:
                        chinese,

                    spanish:
                        spanish,

                    quantity:
                        quantity

                });

                totalStandUnits +=
                    quantity;

            }
        );


    // =================================================
    // OTHER PRODUCTS
    // =================================================

    let otherProductTypes =
        0;

    let otherProductUnits =
        0;

    standsContainer
        .querySelectorAll(
            ".other-product-quantity"
        )
        .forEach(
            input => {

                const quantity =
                    sanitizeQuantity(
                        input.value
                    );

                if (
                    quantity > 0
                ) {

                    otherProductTypes++;

                    otherProductUnits +=
                        quantity;

                }

            }
        );


    // =================================================
    // NOTHING SELECTED
    // =================================================

    if (
        selectedStands.length === 0 &&
        otherProductTypes === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "order-summary-empty";

        empty.textContent =
            "No hay productos seleccionados. / 暂无已选产品";

        orderSummaryContent.appendChild(
            empty
        );

        return;

    }


    // =================================================
    // STAND SUMMARY
    // =================================================

    if (
        selectedStands.length > 0
    ) {

        const stats =
            document.createElement(
                "div"
            );

        stats.className =
            "order-summary-stats";

        stats.textContent =
            selectedStands.length +
            " tipos de estantería / 种货架 · " +
            totalStandUnits +
            " unidades / 个";

        orderSummaryContent.appendChild(
            stats
        );

        const list =
            document.createElement(
                "ul"
            );

        list.className =
            "order-summary-list";

        selectedStands.forEach(
            stand => {

                const item =
                    document.createElement(
                        "li"
                    );

                item.className =
                    "order-summary-item";

                const name =
                    document.createElement(
                        "div"
                    );

                name.className =
                    "order-summary-name";

                const chinese =
                    document.createElement(
                        "span"
                    );

                chinese.className =
                    "chinese";

                chinese.textContent =
                    stand.chinese;

                const spanish =
                    document.createElement(
                        "span"
                    );

                spanish.className =
                    "spanish";

                spanish.textContent =
                    stand.spanish;

                name.appendChild(
                    chinese
                );

                name.appendChild(
                    spanish
                );

                const quantity =
                    document.createElement(
                        "span"
                    );

                quantity.className =
                    "order-summary-quantity";

                quantity.textContent =
                    "× " +
                    stand.quantity;

                item.appendChild(
                    name
                );

                item.appendChild(
                    quantity
                );

                list.appendChild(
                    item
                );

            }
        );

        orderSummaryContent.appendChild(
            list
        );

    }


    // =================================================
    // OTHER PRODUCTS SUMMARY
    // =================================================

    if (
        otherProductTypes > 0
    ) {

        const otherSummary =
            document.createElement(
                "div"
            );

        otherSummary.className =
            "other-products-summary";

        otherSummary.textContent =
            "Otros productos / 其他产品: " +
            otherProductTypes +
            " tipos / 种 · " +
            otherProductUnits +
            " unidades / 个";

        orderSummaryContent.appendChild(
            otherSummary
        );

    }

}


// =====================================================
// NEW ORDER BUTTON
// =====================================================

newOrderButton.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "¿Crear un nuevo pedido?\n" +
                "是否创建新订单？\n\n" +
                "Se borrarán el cliente, dirección, cantidades, extras y otros productos.\n" +
                "客户、地址、数量、额外配件和其他产品将全部清空。"
            );

        if (
            !confirmed
        ) {

            return;

        }

        resetOrder();

    }
);


// =====================================================
// RESET ORDER
// =====================================================

function resetOrder() {

    // =================================================
    // CLIENT
    // =================================================

    clientNameInput.value =
        "";

    clientAddressInput.value =
        "";


    // =================================================
    // STANDS
    // =================================================

    standsContainer
        .querySelectorAll(
            ".accordion"
        )
        .forEach(
            accordion => {

                const checkbox =
                    accordion.querySelector(
                        '.accordion-header input[type="checkbox"]'
                    );

                const quantity =
                    accordion.querySelector(
                        ".accordion-header .quantity"
                    );

                checkbox.checked =
                    false;

                quantity.value =
                    0;


                // =========================================
                // ADDONS
                // =========================================

                accordion
                    .querySelectorAll(
                        ".addon-accordion"
                    )
                    .forEach(
                        addon => {

                            addon.classList.remove(
                                "active"
                            );

                            const addonQuantity =
                                addon.querySelector(
                                    ".addon-quantity"
                                );

                            addonQuantity.value =
                                0;

                            const addonContent =
                                addon.querySelector(
                                    ".addon-content"
                                );

                            const addonArrow =
                                addon.querySelector(
                                    ".addon-arrow"
                                );

                            addonContent.style.display =
                                "none";

                            addonArrow.style.transform =
                                "rotate(-90deg)";

                        }
                    );


                // =========================================
                // CLOSE STAND
                // =========================================

                const content =
                    accordion.querySelector(
                        ".accordion-content"
                    );

                const arrow =
                    accordion.querySelector(
                        ".accordion-arrow"
                    );

                content.style.display =
                    "none";

                arrow.style.transform =
                    "rotate(-90deg)";

            }
        );


    // =================================================
    // OTHER PRODUCTS
    // =================================================

    const otherAccordion =
        standsContainer.querySelector(
            ".other-products-accordion"
        );

    if (
        otherAccordion
    ) {

        otherAccordion
            .querySelectorAll(
                ".other-product-quantity"
            )
            .forEach(
                input => {

                    input.value =
                        0;

                }
            );


        // =============================================
        // REMOVE GREEN FROM ALL OTHER PRODUCT ROWS
        // =============================================

        updateOtherProductsStatus(
            otherAccordion
        );


        const otherContent =
            otherAccordion.querySelector(
                ".other-products-content"
            );

        const otherArrow =
            otherAccordion.querySelector(
                ".other-products-arrow"
            );

        otherContent.style.display =
            "none";

        otherArrow.style.transform =
            "rotate(-90deg)";

    }


    // =================================================
    // DISABLE SELECTED ONLY
    // =================================================

    selectedOnlyMode =
        false;

    selectedOnlyButton.classList.remove(
        "active"
    );

    selectedOnlyButton.textContent =
        "Mostrar seleccionados / 仅显示已选";

    applySelectedOnlyFilter();

    updateOrderSummary();

}


// =====================================================
// PRINT BUTTON
// =====================================================

printButton.addEventListener(
    "click",
    () => {

        printArea.innerHTML =
            "";


        // =================================================
        // STANDS
        // =================================================

        const accordions =
            standsContainer.querySelectorAll(
                ".accordion"
            );

        accordions.forEach(
            accordion => {

                const checkbox =
                    accordion.querySelector(
                        '.accordion-header input[type="checkbox"]'
                    );

                const quantityInput =
                    accordion.querySelector(
                        ".accordion-header .quantity"
                    );

                const standQuantity =
                    sanitizeQuantity(
                        quantityInput.value
                    );

                if (
                    !checkbox.checked ||
                    standQuantity <= 0
                ) {

                    return;

                }

                createPrintPage(
                    accordion,
                    standQuantity
                );

            }
        );


        // =================================================
        // OTHER PRODUCTS
        // =================================================

        const otherProductsAccordion =
            standsContainer.querySelector(
                ".other-products-accordion"
            );

        if (
            otherProductsAccordion
        ) {

            createOtherProductsPrintPage(
                otherProductsAccordion
            );

        }


        // =================================================
        // NOTHING SELECTED
        // =================================================

        if (
            printArea.children.length === 0
        ) {

            alert(
                "Seleccione al menos un producto.\n" +
                "请至少选择一个产品。"
            );

            return;

        }

        window.print();

    }
);


// =====================================================
// ADD CLIENT INFORMATION
// =====================================================

function addClientInfo(
    page
) {

    const clientName =
        clientNameInput.value.trim();

    const clientAddress =
        clientAddressInput.value.trim();

    if (
        clientName === "" &&
        clientAddress === ""
    ) {

        return;

    }

    const clientInfo =
        document.createElement(
            "div"
        );

    clientInfo.className =
        "print-client-info";

    if (
        clientName !== ""
    ) {

        clientInfo.appendChild(
            createClientRow(
                "Cliente / 客户:",
                clientName
            )
        );

    }

    if (
        clientAddress !== ""
    ) {

        clientInfo.appendChild(
            createClientRow(
                "Dirección / 地址:",
                clientAddress
            )
        );

    }

    page.appendChild(
        clientInfo
    );

}


// =====================================================
// CREATE CLIENT ROW
// =====================================================

function createClientRow(
    labelText,
    valueText
) {

    const row =
        document.createElement(
            "div"
        );

    row.className =
        "print-client-row";

    const label =
        document.createElement(
            "span"
        );

    label.className =
        "print-client-label";

    label.textContent =
        labelText;

    const value =
        document.createElement(
            "span"
        );

    value.textContent =
        valueText;

    row.appendChild(
        label
    );

    row.appendChild(
        value
    );

    return row;

}


// =====================================================
// CREATE STAND PRINT PAGE
// =====================================================

function createPrintPage(
    accordion,
    standQuantity
) {

    const page =
        document.createElement(
            "div"
        );

    page.className =
        "print-page";

    addClientInfo(
        page
    );


    // =================================================
    // STAND NAMES
    // =================================================

    const standChinese =
        accordion.querySelector(
            ".stand-name .chinese"
        )
        .textContent
        .trim();

    const standSpanish =
        accordion.querySelector(
            ".stand-name .spanish"
        )
        .textContent
        .trim();


    // =================================================
    // TITLE
    // =================================================

    const title =
        document.createElement(
            "h2"
        );

    title.textContent =
        standChinese;

    page.appendChild(
        title
    );

    const subtitle =
        document.createElement(
            "div"
        );

    subtitle.className =
        "print-subtitle";

    subtitle.textContent =
        standSpanish;

    page.appendChild(
        subtitle
    );


    // =================================================
    // QUANTITY
    // =================================================

    const quantityText =
        document.createElement(
            "div"
        );

    quantityText.className =
        "print-quantity";

    quantityText.textContent =
        "Cantidad de unidades / 数量: " +
        standQuantity;

    page.appendChild(
        quantityText
    );


    // =================================================
    // MAIN COMPONENTS
    // =================================================

    const mainTitle =
        document.createElement(
            "div"
        );

    mainTitle.className =
        "print-section-title";

    mainTitle.textContent =
        "Componentes / 配件";

    page.appendChild(
        mainTitle
    );

    const mainComponents =
        accordion.querySelectorAll(
            ":scope > .accordion-content > .components .component"
        );

    page.appendChild(
        createComponentTable(
            mainComponents,
            standQuantity
        )
    );


    // =================================================
    // ADDONS
    // =================================================

    const addons =
        accordion.querySelectorAll(
            ".addon-accordion"
        );

    addons.forEach(
        addon => {

            const addonQuantityInput =
                addon.querySelector(
                    ".addon-quantity"
                );

            const addonQuantity =
                sanitizeQuantity(
                    addonQuantityInput.value
                );

            if (
                addonQuantity <= 0
            ) {

                return;

            }

            const addonChinese =
                addon.querySelector(
                    ".addon-name .chinese"
                )
                .textContent
                .trim();

            const addonSpanish =
                addon.querySelector(
                    ".addon-name .spanish"
                )
                .textContent
                .trim();

            const addonTitle =
                document.createElement(
                    "div"
                );

            addonTitle.className =
                "print-section-title";

            addonTitle.textContent =
                addonChinese +
                " / " +
                addonSpanish +
                " — Cantidad / 数量: " +
                addonQuantity;

            page.appendChild(
                addonTitle
            );

            const addonComponents =
                addon.querySelectorAll(
                    ".addon-content .component"
                );

            page.appendChild(
                createComponentTable(
                    addonComponents,
                    addonQuantity
                )
            );

        }
    );

    printArea.appendChild(
        page
    );

}


// =====================================================
// CREATE COMPONENT TABLE
// =====================================================

function createComponentTable(
    components,
    multiplier
) {

    const table =
        document.createElement(
            "table"
        );

    const headerRow =
        document.createElement(
            "tr"
        );

    const componentHeader =
        document.createElement(
            "th"
        );

    componentHeader.textContent =
        "Pieza / 配件";

    const quantityHeader =
        document.createElement(
            "th"
        );

    quantityHeader.textContent =
        "Cantidad / 数量";

    headerRow.appendChild(
        componentHeader
    );

    headerRow.appendChild(
        quantityHeader
    );

    table.appendChild(
        headerRow
    );

    components.forEach(
        component => {

            const amountPerUnit =
                sanitizeQuantity(
                    component.dataset.quantity
                );

            const totalAmount =
                amountPerUnit *
                multiplier;

            const chinese =
                component.querySelector(
                    ".component-name .chinese"
                )
                .textContent
                .trim();

            const spanish =
                component.querySelector(
                    ".component-name .spanish"
                )
                .textContent
                .trim();

            table.appendChild(
                createPrintProductRow(
                    chinese,
                    spanish,
                    totalAmount
                )
            );

        }
    );

    return table;

}


// =====================================================
// OTHER PRODUCTS PRINT PAGE
// =====================================================

function createOtherProductsPrintPage(
    accordion
) {

    const selectedProducts =
        [];

    accordion
        .querySelectorAll(
            ".other-product-row"
        )
        .forEach(
            row => {

                const quantity =
                    sanitizeQuantity(
                        row.querySelector(
                            ".other-product-quantity"
                        ).value
                    );

                if (
                    quantity <= 0
                ) {

                    return;

                }

                selectedProducts.push({

                    chinese:
                        row.querySelector(
                            ".other-product-name .chinese"
                        )
                        .textContent
                        .trim(),

                    spanish:
                        row.querySelector(
                            ".other-product-name .spanish"
                        )
                        .textContent
                        .trim(),

                    quantity:
                        quantity

                });

            }
        );

    if (
        selectedProducts.length === 0
    ) {

        return;

    }

    const page =
        document.createElement(
            "div"
        );

    page.className =
        "print-page";

    addClientInfo(
        page
    );

    const title =
        document.createElement(
            "h2"
        );

    title.textContent =
        "其他产品";

    page.appendChild(
        title
    );

    const subtitle =
        document.createElement(
            "div"
        );

    subtitle.className =
        "print-subtitle";

    subtitle.textContent =
        "Otros Productos";

    page.appendChild(
        subtitle
    );

    const table =
        document.createElement(
            "table"
        );

    const headerRow =
        document.createElement(
            "tr"
        );

    const productHeader =
        document.createElement(
            "th"
        );

    productHeader.textContent =
        "Producto / 产品";

    const quantityHeader =
        document.createElement(
            "th"
        );

    quantityHeader.textContent =
        "Cantidad / 数量";

    headerRow.appendChild(
        productHeader
    );

    headerRow.appendChild(
        quantityHeader
    );

    table.appendChild(
        headerRow
    );

    selectedProducts.forEach(
        product => {

            table.appendChild(
                createPrintProductRow(
                    product.chinese,
                    product.spanish,
                    product.quantity
                )
            );

        }
    );

    page.appendChild(
        table
    );

    printArea.appendChild(
        page
    );

}


// =====================================================
// GENERIC PRINT PRODUCT ROW
// =====================================================

function createPrintProductRow(
    chinese,
    spanish,
    quantity
) {

    const row =
        document.createElement(
            "tr"
        );

    const nameCell =
        document.createElement(
            "td"
        );

    const nameContainer =
        document.createElement(
            "div"
        );

    nameContainer.className =
        "print-component-name";

    const chineseElement =
        document.createElement(
            "span"
        );

    chineseElement.className =
        "chinese";

    chineseElement.textContent =
        chinese;

    const spanishElement =
        document.createElement(
            "span"
        );

    spanishElement.className =
        "spanish";

    spanishElement.textContent =
        spanish;

    nameContainer.appendChild(
        chineseElement
    );

    nameContainer.appendChild(
        spanishElement
    );

    nameCell.appendChild(
        nameContainer
    );

    const quantityCell =
        document.createElement(
            "td"
        );

    quantityCell.textContent =
        quantity;

    row.appendChild(
        nameCell
    );

    row.appendChild(
        quantityCell
    );

    return row;

}


// =====================================================
// PDF FILE NAME
// Kept from your existing file even though the current
// version uses the browser print dialog.
// =====================================================

function getPdfFileName() {

    const now =
        new Date();

    const day =
        String(
            now.getDate()
        )
        .padStart(
            2,
            "0"
        );

    const month =
        String(
            now.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );

    const year =
        now.getFullYear();

    const date =
        `${day}-${month}-${year}`;

    const clientName =
        clientNameInput.value.trim();

    if (
        clientName !== ""
    ) {

        return `Pedido Estanteria ${clientName} ${date}.pdf`;

    }

    return `Pedido Estanteria ${date}.pdf`;

}
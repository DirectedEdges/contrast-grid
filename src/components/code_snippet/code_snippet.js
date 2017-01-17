var EightShapes = EightShapes || {};

EightShapes.CodeSnippet = function() {
    'use strict';
    var $codeSnippet,
        formattedCss = false;

    function removeInteractionHooksFromMarkup(html) {
        var $markup = $(html).clone();
        $markup = $markup.find(".es-contrast-grid__key-swatch-controls").remove().end();
        $markup = $markup.find(".es-contrast-grid__table--dragtable-initialized").removeClass('es-contrast-grid__table--dragtable-initialized').end();
        $markup = $markup.find(".es-contrast-grid__content--sortable-initialized.ui-sortable").removeClass('es-contrast-grid__content--sortable-initialized ui-sortable').end();
        console.log($markup);

        return $markup.prop('outerHTML');
    }

    function updateContent(e, content) {
        content = removeInteractionHooksFromMarkup(content);
        $codeSnippet = $(".es-code-snippet code");

        if (!formattedCss) {
            formattedCss = html_beautify($(".es-contrast-grid-styles").removeAttr("class").prop('outerHTML'));
        }

        var formattedHtml = html_beautify(content, {preserve_newlines: false});
        var html = Prism.highlight(formattedHtml + "\n\n" + formattedCss, Prism.languages.html);
        $codeSnippet.html(html);
    }

    function showCodeSnippet() {
        $(".es-contrast-grid__outer-wrap").addClass("es-contrast-grid__outer-wrap--code-snippet-visible");
    }

    function hideCodeSnippet(e) {
        if (typeof e !== 'undefined') {
            e.preventDefault();
        }
        $(".es-contrast-grid__outer-wrap").removeClass("es-contrast-grid__outer-wrap--code-snippet-visible");
    }

    function setEventHandlers() {
        var clipboard = new Clipboard('.es-code-snippet__copy-button');
        clipboard.on('success', function(e) {
            $(e.trigger).removeClass("es-code-snippet__copy-button--clicked");
            $(e.trigger).prop('offsetHeight');
            $(e.trigger).addClass("es-code-snippet__copy-button--clicked").find(".es-code-snippet__copy-response").text('Copied!');
            e.clearSelection();
        });

        clipboard.on('error', function(e) {
            $(e.trigger).removeClass("es-code-snippet__copy-button--clicked");
            $(e.trigger).prop('offsetHeight');
            $(e.trigger).addClass("es-code-snippet__copy-button--clicked").find(".es-code-snippet__copy-response").text('Press Ctrl + C to copy');
        });

        $("body").on("click", ".es-code-snippet__copy-button", function(e){
            e.preventDefault();
        });

        $(".es-code-snippet__hide-snippet").on("click", hideCodeSnippet);

        $(document).on("escg.contrastGridUpdated", updateContent);
        $(document).on("escg.showCodeSnippet", showCodeSnippet);
    }

    var initialize = function initialize() {
        setEventHandlers();
    };

    var public_vars = {
        'initialize': initialize
    };

    return public_vars;
}();

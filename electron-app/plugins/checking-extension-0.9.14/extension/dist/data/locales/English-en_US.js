"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locale = void 0;
const locale_ = {
    "menu": {
        "no_results": "No results",
        "invalidated": "Invalidated",
        "bookmarks": "Bookmarks",
        "selected": "Selected",
        "no_selection": "No selection",
        "verse_edit": "Verse edit",
        "comments": "Comments",
        "menu": "Menu",
        "grouping": "Organize by Reference"
    },
    "buttons": {
        "ok_button": "OK",
        "back_button": "Go Back",
        "cancel_button": "Cancel",
        "reset_button": "Reset",
        "save_button": "Save",
        "next_button": "Next",
        "discard_changes": "Discard Changes"
    },
    "alignments_reset_wa_tool": "Changes have been detected in your project which have invalidated some of your alignments.\nThese verses display an icon of a broken chain next to the reference in the side menu.",
    "invalid_verse_alignments_and_selections": "Changes have been detected in your project which have invalidated some selections and some alignments. These verses display an icon of a broken chain next to the reference in the side menu.",
    "invalidation_checking": "Checking if this edit conflicts with saved selections and alignments...",
    "quote_invalid": "Invalid Original Language Quote for Check: '${quote}'",
    "nothing_to_select_description": "When selected, the check will be marked as complete. Use when the translation is correct but a selection cannot be made.",
    "selections_invalidated": "Some selections are no longer valid and are removed.",
    "see_more": "See more",
    "select": "Select",
    "step2_check": "Step 2. Check",
    "comment": "Comment",
    "edit_verse": "Edit Verse",
    "save_previous": "Save & Previous",
    "save_continue": "Save & Continue",
    "empty_verse": "No selection can be made because the verse is blank.<br/>You may fix this by editing the verse.<br/>If desired, you may also leave a comment or bookmark this check.",
    "no_selection": "No selection has been made.<br/>Click the Select button, then select the translation for this check.",
    "no_selection_needed_description": "No selection has been made.<br/>This check has been marked as:",
    "no_selection_needed": "No selection needed",
    "please_select": "Please select the translation for:",
    "selection_invalidated": "The selection for this check was invalidated.",
    "invalidated_tooltip": "A selection is invalidated if the words selected were then edited.",
    "translated_as": "has been translated as:",
    "bookmark": "Bookmark",
    "cancel": "Cancel",
    "clear_selection": "Clear Selection",
    "save": "Save",
    "spelling": "Spelling",
    "punctuation": "Punctuation",
    "word_choice": "Word Choice",
    "meaning": "Meaning",
    "grammar": "Grammar",
    "other": "Other",
    "select_reasons": "Select reason(s) for change",
    "edit_verse_title": "Edit Verse - ${passage}",
    "next_change_reason": "Next, select reason(s) for change",
    "first_make_change": "First, make changes to verse above",
    "close": "Close",
    "load": "Load",
    "attention": "Attention:",
    "select_translation": "Please ${span} select ${span} the correct translation for your current check.",
    "can_skip": "If you are unable to perform this check, you may ${span} skip it ${span} and come back to it later.",
    "skip": "Skip",
    "click_show_expanded": "Click to show expanded verses",
    "expand_verses": "Expand verses",
    "pre_release": "Pre-release",
    "icons": {
        "selections_found": "Selections were found for this check",
        "no_selections_found": "No selections were found for this check",
        "verse_edits_found": "Verse edits were found for this check",
        "no_verse_edits_found": "No Verse edits were found for this check",
        "comments_found": "Comments were found for this check",
        "no_comments_found": "No comments were found for this check",
        "bookmarked": "This check has been bookmarked for review",
        "not_bookmarked": "This check has not been bookmarked for review"
    },
    "select_too_many": "Click a previous selection to remove it before adding a new one. To select more than ${maximum} words, highlight phrases instead of individual words.",
    "oops": "Oops!",
    "pane": {
        "current_project": "Current project",
        "missing_verse_warning": "[WARNING: This Bible version does not include text for this reference.]",
        "title": "Step 1. Read",
        "expand_hover": "Click to show expanded resource panes",
        "remove_resource": "Click to remove resource",
        "remove_resource_label": "Remove resource",
        "add_resource": "Click to add a resource",
        "add_resource_label": "Add Resources",
        "select_language": "Select language",
        "gateway_language": "Gateway Language",
        "target_language": "Target Language",
        "original_language": "Original Language",
        "select_font_label": "Select Font"
    },
    "lemma": "Lemma:",
    "morphology": "Morphology:",
    "strongs": "Strongs:",
    "lexicon": "Lexicon:",
    "noun": "Noun",
    "substantive_adj": "Substantive adj.",
    "predicate_adj": "Predicate adj.",
    "nominative": "Nominative",
    "genitive": "Genitive",
    "dative": "Dative",
    "accusative": "Accusative",
    "vocative": "Vocative",
    "masculine": "Masculine",
    "feminine": "Feminine",
    "neuter": "Neuter",
    "singular": "Singular",
    "plural": "Plural",
    "adjective": "Adjective",
    "ascriptive": "Ascriptive",
    "restrictive": "Restrictive",
    "determiner": "Determiner",
    "article": "Article",
    "demonstrative": "Demonstrative",
    "differential": "Differential",
    "possessive": "Possessive",
    "quantifier": "Quantifier",
    "number": "Number",
    "ordinal": "Ordinal",
    "relative": "Relative",
    "interrogative": "Interrogative",
    "first": "1st",
    "second": "2nd",
    "third": "3rd",
    "pronoun": "Pronoun",
    "personal": "Personal",
    "reflexive": "Reflexive",
    "reciprocal": "Reciprocal",
    "indefinite": "Indefinite",
    "verb": "Verb",
    "transitive": "Transitive",
    "intransitive": "Intransitive",
    "any": "Any",
    "extraneous": "Extraneous",
    "substantive_adjective": "Substantive Adjective",
    "linking": "Linking",
    "modal": "Modal",
    "periphrastic": "Periphrastic",
    "indicative": "Indicative",
    "imperative": "Imperative",
    "subjunctive": "Subjunctive",
    "optative": "Optative",
    "infinitive": "Infinitive",
    "participle": "Participle",
    "present": "Present",
    "imperfect": "Imperfect",
    "future": "Future",
    "aorist": "Aorist",
    "perfect": "Perfect",
    "pluperfect": "Pluperfect",
    "active": "Active",
    "middle": "Middle",
    "passive": "Passive",
    "interjection": "Interjection",
    "exclamation": "Exclamation",
    "directive": "Directive",
    "response": "Response",
    "preposition": "Preposition",
    "improper": "Improper",
    "adverb": "Adverb",
    "correlative": "Correlative",
    "conjunction": "Conjunction",
    "coordinating": "Coordinating",
    "subordinating": "Subordinating",
    "particle": "Particle",
    "foreign": "Foreign",
    "error": "Error",
    "comparative": "Comparative",
    "superlatives": "Superlative",
    "indeclinable": "Indeclinable",
    "diminutive": "Diminutive",
    "suffix": "Suffix",
    "cardinal_number": "Cardinal Number",
    "gentilic": "Gentilic",
    "ordinal_number": "Ordinal Number",
    "both_genders": "Both Genders",
    "common_gender": "Common Gender",
    "common": "Common",
    "proper_name": "Proper Name",
    "dual": "Dual",
    "affirmation": "Affirmation",
    "definite_article": "Definite Article",
    "exhortation": "Exhortation",
    "negative": "Negative",
    "direct_object_marker": "Direct Object Marker",
    "absolute": "Absolute",
    "construct": "Construct",
    "determined": "Determined",
    "directional_he": "Directional He",
    "paragogic_he": "Paragogic He",
    "paragogic_nun": "Paragogic Nun",
    "pronominal": "Pronominal",
    "perfect_qatal": "Perfect (Qatal)",
    "sequential_perfect_weqatal": "Sequential Perfect (Weqatal)",
    "imperfect_yiqtol": "Imperfect (Yiqtol)",
    "sequential_imperfect_wayyiqtol": "Sequential Imperfect (Wayyiqtol)",
    "cohortative": "Cohortative",
    "jussive": "Jussive",
    "participle_active": "Participle Active",
    "participle_passive": "Participle Passive",
    "infinitive_absolute": "Infinitive Absolute",
    "infinitive_construct": "Infinitive Construct",
    "qal": "Qal",
    "niphal": "Niphal",
    "piel": "Piel",
    "pual": "Pual",
    "hiphil": "Hiphil",
    "hophal": "Hophal",
    "hithpael": "Hithpael",
    "hithpolel": "Hithpolel",
    "polel": "Polel",
    "polal": "Polal",
    "poel": "Poel",
    "poal": "Poal",
    "palel": "Palel",
    "pulal": "Pulal",
    "qal_passive": "Qal passive",
    "pilpel": "Pilpel",
    "polpal": "Polpal",
    "hithpalpel": "Hithpalpel",
    "nithpael": "Nithpael",
    "pealal": "Pealal",
    "pilel": "Pilel",
    "hothpaal": "Hothpaal",
    "tiphil": "Tiphil",
    "hishtaphel": "Hishtaphel",
    "nithpalel": "Nithpalel",
    "nithpoel": "Nithpoel",
    "hithpoel": "Hithpoel",
    "peal": "Peal",
    "peil": "Peil",
    "hithpeel": "Hithpeel",
    "pael": "Pael",
    "ithpaal": "Ithpaal",
    "hithpaal": "Hithpaal",
    "aphel": "Aphel",
    "haphel": "Haphel",
    "saphel": "Saphel",
    "shaphel": "Shaphel",
    "ishtaphel": "Ishtaphel",
    "ithpeel": "Ithpeel",
    "hithaphel": "Hithaphel",
    "hephal": "Hephal",
    "tiphel": "Tiphel",
    "palpel": "Palpel",
    "ithpalpel": "Ithpalpel",
    "ithpolel": "Ithpolel",
    "ittaphal": "Ittaphal",
    "morph_missing": "Morphology not found",
    "unsaved_changes": "You have unsaved changes."
};
exports.locale = locale_;
//# sourceMappingURL=English-en_US.js.map
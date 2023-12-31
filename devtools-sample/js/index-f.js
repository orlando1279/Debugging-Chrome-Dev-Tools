import {B as e, $ as t, a as s, d as i} from "./index-f45448ab.js";
import {c as n, g as o} from "./index-c7a3a5f9.js";
import {g as r, h as a} from "./actions-f0eb5c8e.js";
function l(e, t) {
    void 0 === t && (t = {});
    var s = t.insertAt;
    if (e && "undefined" != typeof document) {
        var i = document.head || document.getElementsByTagName("head")[0]
          , n = document.createElement("style");
        n.type = "text/css",
        "top" === s && i.firstChild ? i.insertBefore(n, i.firstChild) : i.appendChild(n),
        n.styleSheet ? n.styleSheet.cssText = e : n.appendChild(document.createTextNode(e))
    }
}
l("share-action{display:inline-flex;align-items:center;gap:.5em;cursor:pointer;color:var(--color-mid-text)}share-action:hover{filter:invert(.05)}share-action svg{width:1em;height:1em;transform:translateY(-.05ex)}");
class c extends HTMLElement {
    constructor() {
        super();
        const e = function() {
            if (!("share"in window.navigator))
                return !1;
            if ("canShare"in navigator) {
                const e = `https://${window.location.hostname}`;
                return window.navigator.canShare({
                    url: e
                })
            }
            return !0
        }();
        let t = this.getAttribute("data-label") || "";
        t && (t += ", "),
        t += e ? "share" : "twitter",
        this.setAttribute("data-label", t);
        const s = e ? this.onWebShare : this.onTwitterShare;
        this.addEventListener("click", s.bind(this))
    }
    onWebShare(e) {
        e.preventDefault(),
        navigator.share({
            url: this.shareUrl,
            text: this.shareText
        })
    }
    onTwitterShare(e) {
        const t = new URL("https://twitter.com/share");
        t.searchParams.set("url", this.shareUrl),
        t.searchParams.set("text", this.shareText),
        e.preventDefault(),
        window.open(t.toString(), "share-twitter", "width=550,height=235")
    }
    get shareUrl() {
        return window.location.href
    }
    get shareText() {
        const e = this.getAttribute("message");
        if (e && e.length)
            return e;
        let t = "";
        const s = this.getAttribute("authors") || "";
        if (s && s.length) {
            const e = s.split("|").map((e=>e.trim())).filter(Boolean);
            if ("ListFormat"in Intl) {
                t = ` by ${new Intl.ListFormat("en").format(e)}`
            } else
                t = ` by ${e.join(", ")}`
        }
        return document.title + t
    }
}
customElements.define("share-action", c);
customElements.define("web-question", class extends e {
    static get properties() {
        return {
            id: {
                type: String,
                reflect: !0
            },
            state: {
                type: String,
                reflect: !0
            },
            height: {
                type: String,
                attribute: "question-height"
            }
        }
    }
    constructor() {
        super(),
        this.state = "unanswered",
        this.prerenderedChildren = null,
        this.ctaLabel = "Check",
        this.responseComponentUpdated = this.responseComponentUpdated.bind(this),
        this.reset = this.reset.bind(this),
        this.height = null
    }
    render() {
        if (!this.prerenderedChildren) {
            this.prerenderedChildren = [];
            for (const e of this.children)
                this.prerenderedChildren.push(e)
        }
        const e = this.height ? "height: " + this.height + ";" : "";
        return t`
      <div class="web-question__content" style="${e}">
        ${this.prerenderedChildren}
      </div>
      <hr />
      <div class="web-question__footer gap-top-size-1 ta-right">
        <button
          @click="${this.onSubmit}"
          class="button web-assessment__button web-question__cta gc-analytics-event"
          data-category="Self-assessments"
          data-label="CTA, ${this.id}"
          data-type="primary"
          ?disabled="${"unanswered" === this.state}"
        >
          ${this.ctaLabel}
        </button>
      </div>
    `
    }
    firstUpdated() {
        this.addEventListener("response-update", this.responseComponentUpdated),
        this.addEventListener("question-option-select", (e=>{
            const t = e
              , {detail: i, target: n} = t;
            let o = -1;
            const r = Array.from(this.querySelectorAll("[data-role=response]"));
            for (let e = 0; e < r.length; ++e)
                if (r[e].contains(n)) {
                    o = e;
                    break
                }
            -1 !== o && s("click", {
                event_category: "Self-assessments",
                event_label: `${this.id}-response-${o}-option-${i}`
            })
        }
        ))
    }
    responseComponentUpdated() {
        const e = this.querySelectorAll("[data-role=response]")
          , t = Array.from(e).map((({state: e})=>e));
        t.includes("unanswered") ? this.state = "unanswered" : t.includes("answeredIncorrectly") ? this.state = "answeredIncorrectly" : this.state = "answeredCorrectly"
    }
    onSubmit() {
        switch (this.state) {
        case "answeredCorrectly":
            this.updateResponseComponents(),
            this.state = "completed",
            this.ctaLabel = this.checkNextQuestion() ? "Next" : "Reset quiz";
            break;
        case "answeredIncorrectly":
            this.updateResponseComponents(),
            this.state = "unanswered",
            this.ctaLabel = "Recheck";
            const e = this.closest("web-tabs")
              , t = this.closest("web-assessment");
            e ? e.focusTab(e.activeTab) : t && t.focus();
            break;
        case "completed":
            this.checkNextQuestion() ? this.requestNextQuestionNav() : this.requestAssessmentReset()
        }
    }
    updateResponseComponents() {
        const e = this.querySelectorAll("[data-role=response]");
        for (const t of e)
            t.submitResponse()
    }
    checkNextQuestion() {
        const e = this.closest(".web-tabs__panel");
        if (e)
            return e.nextElementSibling
    }
    requestNextQuestionNav() {
        const e = new Event("request-nav-to-next");
        this.dispatchEvent(e)
    }
    requestAssessmentReset() {
        const e = new Event("request-assessment-reset",{
            bubbles: !0
        });
        this.dispatchEvent(e)
    }
    reset() {
        const e = this.querySelectorAll("[data-role=response]")
          , t = this.querySelector(".web-question__content");
        for (const t of e)
            t.reset();
        this.ctaLabel = "Check",
        t.scrollTop = 0
    }
}
);
customElements.define("web-codelab", class extends e {
    static get properties() {
        return {
            glitch: {
                type: String
            },
            path: {
                type: String
            },
            snapshot: {
                type: Boolean
            },
            _isDesktop: {
                type: Boolean
            }
        }
    }
    constructor() {
        super(),
        this.glitch = "",
        this.path = "index.html",
        this._mql = window.matchMedia("(min-width: 1000px)"),
        this._toggleDesktop = ()=>this._isDesktop = this._mql.matches,
        this.snapshot = !1
    }
    connectedCallback() {
        super.connectedCallback(),
        this._mql.addEventListener("change", this._toggleDesktop),
        this._toggleDesktop()
    }
    disconnectedCallback() {
        super.connectedCallback(),
        this._mql.removeEventListener("change", this._toggleDesktop)
    }
    createRenderRoot() {
        const e = document.createElement("div");
        return e.className = "web-codelab__glitch",
        this.appendChild(e),
        e
    }
    glitchSrc(e) {
        let t = "https://glitch.com/embed/?attributionHidden=true";
        return this.path && (t += `&path=${encodeURI(this.path)}`),
        e && (t += `#!/embed/${encodeURI(this.glitch)}`),
        t
    }
    render() {
        if (!this.glitch)
            return t``;
        if (!this._isDesktop)
            return t`
        <div class="aside flow bg-state-warn-bg color-core-text">
          <p class="cluster">
            <span class="aside__icon box-block color-state-warn-text"
              ><svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                role="img"
                aria-label="Warning sign"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M23 21L12 2 1 21h22zm-12-3v-2h2v2h-2zm0-4h2v-4h-2v4z"
                /></svg
            ></span>
            <strong>Warning</strong>
          </p>
          <div>
            This Glitch isn't available on small screens,
            <a target="_blank" rel="noopener" href=${this.glitchSrc(!1)}>
              open it in a new tab.</a
            >
          </div>
        </div>
      `;
        const e = this.snapshot ? t`<div
          class="web-codelab__glitch-iframe web-codelab__glitch-snapshot"
        ></div>` : t`<iframe
          allow="geolocation; microphone; camera; midi; encrypted-media"
          alt="Embedded glitch ${this.glitch}"
          class="web-codelab__glitch-iframe"
          title="Embedded glitch ${this.glitch}"
          src="${this.glitchSrc(!0)}"
        >
        </iframe>`;
        return t` <div class="web-codelab__glitch-container">${e}</div> `
    }
}
);
l('@keyframes fadein{0%{opacity:0}to{opacity:1}}@keyframes scaleup{0%{transform:scale(.8)}to{transform:scale(1)}}.web-modal{align-items:center;background:rgba(0,0,0,.32);bottom:0;display:flex;justify-content:center;left:0;opacity:0;overflow:auto;padding:1em;position:fixed;right:0;top:0;transition:visibility 0s .15s;visibility:hidden;z-index:275}.web-modal .web-modal__container{background:get-color("shades-light-bright");border-radius:10px;box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);display:flex;flex-direction:column;margin:auto;max-height:100%;max-width:35em;min-height:20em;pointer-events:auto;width:26em}.web-modal .web-modal__header{border-bottom:1px solid transparent;margin:0;padding:1.5rem 1.5rem .5rem}.web-modal .web-modal__content{flex:1;overflow:auto;padding:0 1.5rem}.web-modal .web-modal__footer{border-top:1px solid transparent;display:grid;gap:.5rem;grid-template-columns:1fr auto;justify-items:end;padding:1rem}.web-modal .web-modal__button{height:44px}.web-modal[open]{opacity:1;transition:visibility 0s;visibility:visible}.web-modal[animatable]{animation:fadein 75ms linear reverse}.web-modal[animatable][open]{animation:fadein .15s linear}.web-modal[animatable][open] .web-modal__container{animation:scaleup .15s cubic-bezier(0,0,.2,1),fadein 75ms linear}.web-modal[overflow] .web-modal__footer,.web-modal[overflow] .web-modal__header{border-color:get-color("shades-gray-glare")}');
class h extends e {
    static get properties() {
        return {
            open: {
                type: Boolean,
                reflect: !0
            },
            animatable: {
                type: Boolean,
                reflect: !0
            },
            overflow: {
                type: Boolean,
                reflect: !0
            },
            parentModal: {
                type: String,
                reflect: !0,
                attribute: "parent-modal"
            }
        }
    }
    constructor() {
        super(),
        this.open_ = !1,
        this.animatable = !1,
        this.overflow = !1,
        this._triggerElement = null,
        this._parent = null,
        this.parentModal = null,
        this.onKeyUp = this.onKeyUp.bind(this),
        this.onResize = this.onResize.bind(this),
        this.onAnimationEnd = this.onAnimationEnd.bind(this)
    }
    connectedCallback() {
        super.connectedCallback(),
        this.addEventListener("click", this.onClick),
        this.tabIndex = -1,
        this.inert = !this.open
    }
    disconnectedCallback() {
        super.disconnectedCallback(),
        this.removeEventListener("click", this.onClick),
        window.setTimeout((()=>{
            this.isConnected || (this.open = !1)
        }
        ), 0)
    }
    set open(e) {
        if (this.open_ === e)
            return;
        const t = this.open_;
        if (this.open_ = e,
        this.open_)
            this._triggerElement = document.activeElement,
            this.addEventListener("keyup", this.onKeyUp),
            window.addEventListener("resize", this.onResize);
        else {
            const e = new Event("close-modal");
            this.dispatchEvent(e),
            window.removeEventListener("resize", this.onResize)
        }
        this.manageDocument(),
        this.animatable = !0,
        this.addEventListener("animationend", this.onAnimationEnd, {
            once: !0
        }),
        this.inert = this.open,
        this.requestUpdate("open", t)
    }
    get open() {
        return this.open_
    }
    onClick(e) {
        e.currentTarget === e.target && (this.open = !1)
    }
    onKeyUp(e) {
        "Escape" === e.key && (this.open = !1)
    }
    onAnimationEnd() {
        this.animatable = !1,
        this.manageFocus(),
        this.open ? (this.onResize(),
        window.addEventListener("resize", this.onResize)) : (window.removeEventListener("resize", this.onResize),
        this.removeEventListener("keyup", this.onKeyUp)),
        this.inert = !this.open
    }
    onResize() {
        const e = this.querySelector(".web-modal__content");
        e && (this.overflow = n(e, "height"))
    }
    manageDocument() {
        if (this.open) {
            r();
            const e = this.closest(this.parentModal);
            e && (e.inert = !0,
            this._parent = e)
        } else
            !this.open && this.parentModal ? parent && (parent.inert = !1,
            this._parent = null) : a()
    }
    manageFocus() {
        this.open ? this.focus() : this._triggerElement ? (this._triggerElement.focus(),
        this._triggerElement = null) : document.body.focus()
    }
}
customElements.define("web-assessment", class extends h {
    static get properties() {
        return {
            modal: {
                attribute: "aria-modal",
                reflect: !0
            },
            open: {
                type: Boolean,
                reflect: !0
            },
            animatable: {
                type: Boolean,
                reflect: !0
            },
            overflow: {
                type: Boolean,
                reflect: !0
            },
            parentModal: {
                type: String,
                reflect: !0,
                attribute: "parent-modal"
            }
        }
    }
    constructor() {
        super(),
        this.modal = !1,
        this._placeholder = null,
        this.breakpoint_ = matchMedia("(min-width: 481px)"),
        this.onAssessmentAnimationEnd = this.onAssessmentAnimationEnd.bind(this),
        this.onAssessmentResize = this.onAssessmentResize.bind(this),
        this.reset = this.reset.bind(this),
        this.onOpenClick = this.onOpenClick.bind(this),
        this.openAssessment = this.openAssessment.bind(this),
        this.closeAssessment = this.closeAssessment.bind(this)
    }
    render() {
        if (!this.prerenderedChildren) {
            this.prerenderedChildren = [],
            this.setLeader = [];
            for (const e of this.children)
                e.classList.contains("web-assessment__set-leader") ? this.setLeader.push(e) : this.prerenderedChildren.push(e)
        }
        return t`
      <div class="web-assessment__header flow flow-space-size-0">
        <h2 class="web-assessment__lockup">Check your understanding</h2>
        ${this.setLeader}
      </div>
      ${this.prerenderedChildren}
    `
    }
    firstUpdated() {
        this.classList.remove("unresolved"),
        this.inert = !1,
        this.addEventListener("request-assessment-reset", this.reset);
        const e = [...document.querySelectorAll("web-assessment")].indexOf(this);
        this.id = "web-assessment-" + e;
        Array.from(this.querySelectorAll("web-question")).forEach(((e,t)=>{
            e.setAttribute("id", `${this.id}-question-${t}`)
        }
        ))
    }
    addUniqueID(e, t) {
        const s = [...e].indexOf(t);
        "undefined" === t.id && (t.id = s)
    }
    connectedCallback() {
        super.connectedCallback(),
        this.breakpoint_.addListener(this.onAssessmentResize)
    }
    disconnectedCallback() {
        super.disconnectedCallback(),
        this.breakpoint_.removeListener(this.onAssessmentResize)
    }
    onOpenClick() {
        this.open = !0
    }
    onCloseClick() {
        this.open = !1
    }
    updated(e) {
        e.has("open") && (this.modal = this.open,
        this.open ? this.openAssessment() : this.addEventListener("animationend", this.closeAssessment, {
            once: !0
        }))
    }
    openAssessment() {
        this._placeholder = this.previousElementSibling,
        this.setAttribute("role", "dialog"),
        this.addEventListener("animationend", this.onAssessmentAnimationEnd, {
            once: !0
        }),
        document.body.append(this)
    }
    closeAssessment() {
        this.inert = !1,
        this._placeholder && (this._placeholder.after(this),
        this._placeholder = null)
    }
    onAssessmentAnimationEnd() {
        const e = this.querySelector("web-tabs");
        e && (e.onResize(),
        e.focusTab(e.activeTab))
    }
    onAssessmentResize() {
        this.open = !1,
        this.removeAttribute("role")
    }
    reset() {
        const e = this.querySelector("web-tabs")
          , t = this.querySelectorAll("web-question");
        for (const e of t)
            e.reset();
        e && e.focusTab(0)
    }
}
);
class d extends e {
    static get properties() {
        return {
            state: {
                type: String,
                reflect: !0
            },
            correctAnswer: {
                attribute: "correct-answer",
                type: String
            }
        }
    }
    constructor() {
        super(),
        this.state = "unanswered",
        this.correctAnswer = "",
        this.maxSelections = null,
        this.minSelections = null,
        this.deselectOption = this.deselectOption.bind(this),
        this.enforceCardinality = this.enforceCardinality.bind(this),
        this.submitResponse = this.submitResponse.bind(this),
        this.reset = this.reset.bind(this),
        this.scrollToOption = i(this.scrollToOption.bind(this), 100)
    }
    static getSelectionRange(e) {
        let t = 1
          , s = null;
        return "1" === e || (/^\d+$/.test(e) ? (t = parseInt(e),
        s = t) : /^\d+\+$/.test(e) ? (t = parseInt(e),
        s = 0) : /^\d-\d+$/.test(e) && ([t,s] = e.split("-").map(parseInt))),
        {
            min: t,
            max: s
        }
    }
    firstUpdated() {
        this.identifyCorrectOptions()
    }
    updated() {
        this.reportUpdate()
    }
    reportUpdate() {
        const e = new CustomEvent("response-update",{
            bubbles: !0,
            detail: {
                responseState: this.state
            }
        });
        this.dispatchEvent(e)
    }
    identifyCorrectOptions() {
        if (!this.correctAnswer)
            return;
        const e = this.correctAnswer.split(",").map(Number)
          , t = this.querySelectorAll("[data-role=option]");
        for (let s = 0; s < t.length; s++)
            e.includes(s) && t[s].setAttribute("data-correct", "")
    }
    enforceCardinality() {
        const e = this.querySelectorAll("[data-role=option]");
        let t = 0;
        for (const s of e)
            s.hasAttribute("data-selected") && t++;
        const s = this.checkIfCorrect();
        if (t >= this.minSelections && s ? this.state = "answeredCorrectly" : t >= this.minSelections && !s ? this.state = "answeredIncorrectly" : this.state = "unanswered",
        0 !== this.maxSelections && null !== this.maxSelections)
            for (const s of e) {
                const e = s.hasAttribute("data-selected")
                  , i = s.hasAttribute("data-submitted");
                t < this.maxSelections && !e && !i ? this.enableOption(s) : e || i || this.disableOption(s)
            }
    }
    checkIfCorrect() {
        const e = this.correctAnswer.split(",").map(Number)
          , t = this.querySelectorAll("[data-role=option]")
          , s = [];
        return t.forEach(((e,t)=>{
            e.hasAttribute("data-selected") && s.push(t)
        }
        )),
        e.every((e=>s.includes(e)))
    }
    scrollToOption(e) {
        const t = parseFloat(window.getComputedStyle(e, null).getPropertyValue("padding-top"));
        this.parentElement.scrollTo({
            top: e.offsetTop - this.parentElement.offsetTop - t,
            left: 0,
            behavior: "smooth"
        })
    }
    submitResponse() {
        const e = this.querySelectorAll("[data-role=option]");
        for (const t of e) {
            const e = t.hasAttribute("data-selected")
              , s = t.hasAttribute("data-correct")
              , i = t.hasAttribute("data-submitted");
            "answeredIncorrectly" === this.state ? e && s ? (t.setAttribute("data-submitted", ""),
            this.disableOption(t)) : e && !s ? (t.setAttribute("data-submitted", ""),
            this.disableOption(t),
            "function" == typeof this.deselectOption && this.deselectOption(t)) : e || i || this.enableOption(t) : "answeredCorrectly" === this.state && (this.disableOption(t),
            e && (this.scrollToOption(t),
            t.setAttribute("data-submitted", "")))
        }
        "answeredIncorrectly" === this.state && (this.state = "unanswered")
    }
    reset() {
        const e = this.querySelectorAll("[data-role=option]");
        this.state = "unanswered";
        for (const t of e)
            t.removeAttribute("data-submitted"),
            "function" == typeof this.deselectOption && this.deselectOption(t),
            this.enableOption(t)
    }
    deselectOption(e) {}
    disableOption(e) {
        const t = e.querySelectorAll("input, button");
        e.setAttribute("disabled", "");
        for (const e of t)
            e.disabled = !0
    }
    enableOption(e) {
        const t = e.querySelectorAll("input, button");
        e.removeAttribute("disabled");
        for (const e of t)
            e.disabled = !1
    }
}
customElements.define("web-response-mc", class extends d {
    static get properties() {
        return {
            id: {
                type: String,
                reflect: !0
            },
            cardinality: {
                type: String
            },
            columns: {
                type: Boolean
            },
            state: {
                type: String,
                reflect: !0
            },
            correctAnswer: {
                attribute: "correct-answer",
                type: String
            }
        }
    }
    constructor() {
        super(),
        this.prerenderedChildren = null,
        this.options = null,
        this.optionContents = null,
        this.rationales = null,
        this.minSelections = null,
        this.maxSelections = null,
        this.selectType = null,
        this.cardinality = null,
        this.columns = !1,
        this.onOptionInput = this.onOptionInput.bind(this),
        this.deselectOption = this.deselectOption.bind(this),
        this.updateSelections = this.updateSelections.bind(this),
        this._formName = o("web-response-mc-form-")
    }
    render() {
        const e = this.correctAnswer.split(",").map(Number);
        this.selectType = "1" === this.cardinality ? "radio" : "checkbox";
        const s = d.getSelectionRange(this.cardinality);
        if (this.minSelections = s.min,
        this.maxSelections = s.max,
        !this.prerenderedChildren) {
            this.prerenderedChildren = [],
            this.options = [],
            this.optionContents = [],
            this.rationales = [];
            for (const e of this.children) {
                switch (e.getAttribute("data-role")) {
                case "option":
                    this.optionContents.push(e);
                    break;
                case "rationale":
                    this.rationales.push(e);
                    break;
                default:
                    this.prerenderedChildren.push(e)
                }
            }
            for (let t = 0; t < this.optionContents.length; t++) {
                const s = e.includes(t);
                this.options.push(this.optionTemplate(this.optionContents[t], this.rationales[t], s))
            }
        }
        return t`
      ${this.prerenderedChildren}
      <fieldset
        class="web-select-group web-response-mc"
        ?columns="${this.columns}"
      >
        <div class="web-select-group__options-wrapper">
          ${this.options.map(((e,s)=>t`
                <label
                  class="web-select-group__option web-response-mc__option"
                  data-role="option"
                >
                  <input
                    @input=${this.onOptionInput}
                    @click=${this.onOptionClick}
                    class="web-select-group__input web-response-mc__input gc-analytics-event"
                    type="${this.selectType}"
                    name="web-response-mc-form-${this._formName}"
                    value="${s}"
                  />
                  <span
                    class="web-select-group__selector web-response-mc__selector"
                  ></span>
                  <span class="web-select-group__option-content">
                    ${e}
                  </span>
                </label>
              `))}
        </div>
      </fieldset>
    `
    }
    optionTemplate(e, t, s) {
        const i = document.createElement("div");
        return i.className = "web-response__correctness-flag",
        i.textContent = s ? "Correct" : "Incorrect",
        e.append(i),
        t.className = "web-response__option-rationale",
        e.append(t),
        e.removeAttribute("data-role"),
        e
    }
    firstUpdated() {
        super.firstUpdated()
    }
    onOptionInput(e) {
        this.updateSelections(e),
        this.enforceCardinality()
    }
    onOptionClick(e) {
        const t = e.target
          , s = Number(t.value)
          , i = new CustomEvent("question-option-select",{
            detail: s,
            bubbles: !0
        });
        this.dispatchEvent(i)
    }
    updateSelections(e) {
        const t = this.querySelectorAll("[data-role=option]")
          , s = e.target.closest("[data-role=option]");
        if (e.target.checked) {
            if ("1" === this.cardinality)
                for (const e of t)
                    e.removeAttribute("data-selected");
            s.setAttribute("data-selected", "")
        } else
            s.removeAttribute("data-selected")
    }
    deselectOption(e) {
        e.removeAttribute("data-selected"),
        e.querySelector("input").checked = !1
    }
}
);
customElements.define("web-response-tac", class extends d {
    constructor() {
        super(),
        this.prerenderedChildren = null,
        this.option = null,
        this.reset = this.reset.bind(this)
    }
    render() {
        if (!this.prerenderedChildren) {
            this.prerenderedChildren = [],
            this.option = [];
            for (const e of this.children)
                "rationale" === e.getAttribute("data-role") ? (e.setAttribute("data-role", "option"),
                e.className = "web-response__option-rationale web-response-tac__option-rationale",
                this.option.push(e)) : this.prerenderedChildren.push(e)
        }
        return t`${this.prerenderedChildren} ${this.option}`
    }
    connectedCallback() {
        super.connectedCallback(),
        this.state = "answeredCorrectly"
    }
    reset() {
        super.reset(),
        this.state = "answeredCorrectly"
    }
}
);
customElements.define("web-select-group", class extends e {
    static get properties() {
        return {
            type: {
                type: String
            },
            prefix: {
                type: String
            },
            columns: {
                type: Boolean
            }
        }
    }
    constructor() {
        super(),
        this.idSalt = o("web-select-group-"),
        this.selectors = null,
        this.type = null,
        this.prefix = null,
        this.columns = !1
    }
    render() {
        if (this.prefix || (this.prefix = ""),
        !this.selectors) {
            this.selectors = [];
            for (let e = 0; e < this.children.length; e++)
                this.selectors.push(this.selectorTemplate(e, this.children[e], this.type, this.prefix))
        }
        return t`
      <fieldset
        class="web-select-group flow ${this.prefix}"
        ?columns="${this.columns}"
      >
        <div class="web-select-group__options-wrapper">${this.selectors}</div>
      </fieldset>
    `
    }
    selectorTemplate(e, s, i, n) {
        let o = ""
          , r = ""
          , a = "";
        return n && (o = n + "__option",
        r = n + "__input",
        a = n + "__selector"),
        t`
      <label
        class="web-select-group__option ${o}"
        data-category="Site-Wide Custom Events"
        data-label="${i}, web-select-group-${this.idSalt}-${e}"
      >
        <input
          @change="${this.onChange}"
          class="web-select-group__input ${r}"
          type="${i}"
          name="web-select-group-${this.idSalt}"
          value="${e}"
        />
        <span class="web-select-group__selector ${a}"></span>
        <span class="web-select-group__option-content">${s}</span>
      </label>
    `
    }
    onChange() {
        this.reportSelections()
    }
    reportSelections() {
        const e = this.querySelectorAll("input");
        let t = 0;
        for (const s of e)
            s.checked && t++;
        const s = new CustomEvent("change-selections",{
            detail: {
                numSelections: t
            }
        });
        this.dispatchEvent(s)
    }
}
);
customElements.define("web-scroll-spy", class extends e {
    constructor() {
        super(),
        this.scrollSpy = this.scrollSpy.bind(this),
        this.tocActiveClass = "scroll-spy__active",
        this.tocVisibleClass = "scroll-spy__visible"
    }
    connectedCallback() {
        super.connectedCallback(),
        this.articleContent = document.querySelector("main"),
        this.articleContent && (this.headings = this.articleContent.querySelectorAll("h1[id], h2[id], h3[id]"),
        this.observer = new IntersectionObserver(this.scrollSpy,{
            rootMargin: "0px 0px -80% 0px"
        }),
        this.headings.forEach((e=>this.observer.observe(e))))
    }
    disconnectedCallback() {
        super.disconnectedCallback(),
        this.observer.disconnect()
    }
    scrollSpy(e) {
        const t = new Map([...this.querySelectorAll("a")].map((e=>[e.getAttribute("href"), e])));
        for (const s of e) {
            const e = `#${s.target.getAttribute("id")}`
              , i = t.get(e);
            i && (s.intersectionRatio > 0 ? (i.classList.add(this.tocVisibleClass),
            this.previouslyActiveHeading = s.target.getAttribute("id")) : i.classList.remove(this.tocVisibleClass));
            const n = this.querySelector(`.${this.tocVisibleClass}`);
            if (t.forEach((e=>{
                e.classList.remove(this.tocActiveClass, this.tocVisibleClass)
            }
            )),
            n && n.classList.add(this.tocActiveClass),
            !n && this.previouslyActiveHeading) {
                this.querySelector(`a[href="#${this.previouslyActiveHeading}"]`).classList.add(this.tocActiveClass)
            }
        }
    }
}
);

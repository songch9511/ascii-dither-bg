import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

const DEFAULT_SCRIPT_URL =
    "https://cdn.jsdelivr.net/gh/songch9511/ascii-dither-bg@v1.0.0/ascii-dither-background.js"

/**
 * ASCII Dither Background — fills the parent container at any width.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 * @framerDisableUnlink
 */
export default function AsciiDitherBackground(props) {
    const { scriptUrl, fitMode, zIndex } = props
    const hostRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const host = hostRef.current
        if (!host) return undefined

        host.style.position = "absolute"
        host.style.inset = "0"
        host.style.width = "100%"
        host.style.height = "100%"
        host.style.zIndex = String(zIndex)
        host.style.pointerEvents = "none"
        host.style.overflow = "hidden"

        const objectFitValue =
            fitMode === "stretch"
                ? "fill"
                : fitMode === "contain"
                ? "contain"
                : "cover"

        const styleEl = document.createElement("style")
        styleEl.textContent = `
            [data-ascii-dither-bg] {
                position: absolute !important;
                inset: 0 !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100% !important;
                height: 100% !important;
            }
            [data-ascii-dither-bg] canvas {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                max-width: none !important;
                max-height: none !important;
                transform: none !important;
                object-fit: ${objectFitValue} !important;
            }
        `

        const mountDiv = document.createElement("div")
        mountDiv.setAttribute("data-ascii-dither-bg", "")
        mountDiv.setAttribute("aria-hidden", "true")

        host.appendChild(styleEl)
        host.appendChild(mountDiv)

        if (!scriptUrl) return undefined

        const script = document.createElement("script")
        script.src = scriptUrl
        script.async = true
        host.appendChild(script)

        return () => {
            const mount = host.querySelector("[data-ascii-dither-bg]") as
                | (Element & { __asciiDitherDestroy?: () => void })
                | null
            if (mount && typeof mount.__asciiDitherDestroy === "function") {
                mount.__asciiDitherDestroy()
            }
            host.replaceChildren()
        }
    }, [scriptUrl, fitMode, zIndex])

    return (
        <div
            ref={hostRef}
            aria-hidden="true"
            style={{ width: "100%", height: "100%" }}
        />
    )
}

AsciiDitherBackground.defaultProps = {
    scriptUrl: DEFAULT_SCRIPT_URL,
    fitMode: "cover",
    zIndex: 0,
}

addPropertyControls(AsciiDitherBackground, {
    scriptUrl: {
        type: ControlType.String,
        title: "Script URL",
        defaultValue: DEFAULT_SCRIPT_URL,
        placeholder: "https://...ascii-dither-background.js",
    },
    fitMode: {
        type: ControlType.Enum,
        title: "Fit",
        options: ["cover", "contain", "stretch"],
        optionTitles: ["Cover (crop)", "Contain (letterbox)", "Stretch"],
        defaultValue: "cover",
    },
    zIndex: {
        type: ControlType.Number,
        title: "Z Index",
        defaultValue: 0,
        min: -10,
        max: 100,
        step: 1,
    },
})

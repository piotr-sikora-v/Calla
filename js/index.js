﻿/* global JITSI_HOST */

import { ariaLabel, className, href, rel, role, target, title } from "./src/html/attrs.js";
import { A, H2, P, Span } from "./src/html/tags.js";
import { init } from "./src/init.js";
import { ExternalJitsiClient as JitsiClient } from "./src/jitsi/ExternalJitsiClient.js";

const { toolbar, login } = init(JITSI_HOST, JitsiClient);

function adLink(url, label, icon) {
    return A(
        href(url),
        target("_blank"),
        rel("noopener"),
        ariaLabel(label.replace("GitHub", "Git Hub")),
        title(label),
        Span(className(`icon icon-${icon}`),
            role("presentation")));
}

toolbar.append(
    adLink(
        "https://github.com/capnmidnight/Calla",
        "Follow Calla on GitHub",
        "github"),
    adLink(
        "https://twitter.com/Sean_McBeth",
        "Follow Sean on Twitter",
        "twitter"));

login.content.append(
    H2("Made by"),
    P(adLink(
        "https://www.seanmcbeth.com",
        "Sean T. McBeth",
        "shrink"),
        "Sean T. McBeth"),
    P(adLink("https://twitter.com/Sean_McBeth",
        "Follow Sean on Twitter",
        "twitter"),
        "Follow @Sean_McBeth on Twitter"));
                                                                       
  Project documentation lives in Memoir, not in this repo, accessed via
  the Memoir MCP server.


  ### Reading                                                                                                                                                                                                                                                                      
                                                                  
  Before editing code in an unfamiliar area, query Memoir narrowly for
  docs describing what you're about to touch. Read those. Don't pull the
  whole tree.    
  
                                                                                                                        
  ### Mental model
                                                                                                                                                                                                                                                                                   
  Docs are read by future agents and humans who have NO context about what
  you just did. They want current state, densely stated. They do not want
  a changelog, a narrative, or an explanation of what was just fixed —
  commit messages carry that.                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                    
   
  ### Writing — minimal by default                                                                                                                                                                                                                                                 
                                                                  
  Agents over-edit docs. This is the failure mode to defend against.

  - **Scope of doc edit = scope of code change.** Update only docs that                                                                                                                                                                                                            
    describe something the commit actually changed (schema, routes, UI,
    behavior).                                                                                                                                                                                                                                                                     
  - **If a doc is still correct, don't touch it.** "Making it feel fresh"                                                                                                                                                                                                          
    is not a reason to edit.
  - **Surgical edits.** Change the sentence that's now wrong; leave the                                                                                                                                                                                                            
    rest alone. No rewrites.                                                                                                                                                                                                                                                       
  - **Delete what's now stale.** Don't pile new facts on top of old ones
    — that's how docs rot.                                                                                                                                                                                                                                                         
  - **No history inside docs.** No "Recently added:", "As of <date>:",                                                                                                                                                                                                             
    or change-log entries. Docs describe current state only.
  - **No filler.** Every sentence must carry factual weight for a                                                                                                                                                                                                                  
    context-free reader. Don't restate what the code obviously says.
  - **Don't invent.** If you don't know a detail, omit it.                                                                                                                                                                                                                         
  - Use Memoir's draft → commit flow, not one-shot writes.                                                                                                                                                                                                                         
   
  README.md stays minimal and points readers to Memoir. If Memoir is                                                                                                                                                                                                               
  unreachable, STOP and tell me.                                  
                                                                                                                                                                                                                                                                                   
  Updating Memoir docs is part of the definition of done for any code
  change. Not a follow-up task.

## Memoir (team knowledge base)

Memoir is the team's living documentation, exposed via MCP. Reach for it
proactively whenever your work touches shared knowledge, decisions, or facts
that outlive the current conversation.

**First time on this repo (no Memoir docs yet)?**
- Invoke the `seed` prompt to bootstrap foundational docs from the code.
  In Claude Code the user can kick it off directly with
  `/mcp__memoir__seed`; other clients expose it through their MCP prompt
  picker. It walks the repo, picks a small set of big-rocks subsystems
  (scaled to codebase size), and pushes seed notes via `push_notes`. The
  user reviews the resulting drafts in their Memoir inbox.

**Before starting work:**
- `ask_question` — when the task depends on prior context (e.g. "how does
  our auth work?", "what's the deploy process?"). One call beats reading many
  docs by hand.
- `search_docs` / `list_documents` / `list_children` — to find or browse
  related docs by topic or tree location.
- `get_document` — once you know the doc ID, pull the full markdown.

**After significant work:**
- `push_notes` — whenever the conversation produces durable knowledge the
  team should have: architectural decisions, bug root causes, new config or
  conventions, onboarding gotchas, meeting notes. Memoir groups notes by
  topic, routes them to the right docs, and saves edits as DRAFTS. The user
  reviews and publishes from the Memoir dashboard — do NOT assume edits are
  live.

**Heuristic:** if a future teammate would benefit from this, push it. If it
only matters inside the current session (progress updates, debug
scratchpads), skip.

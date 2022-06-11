# Timmy-s-Treasure-Hunt

Play here: https://renardlgr.github.io/Timmy-s-Treasure-Hunt/

# How to play?
Timmy (in white) came across a treasure map that self-destructs after a short time. Help Timmy get to the treasure (in yellow) but don't bump into any obstacles!
Demo: https://www.youtube.com/watch?v=qqjvSnu319Q

# How does it work?
Each map is randomly generated and has a solution. To do so, the algorithm sets to valid every cells (except obstacles) in the von Neumann neighborhood [1] of either Timmy or a valid cell. The process is repeated, adding a new generation of valid cells, until no valid cells are added. If the collection of valid cells contains the treasure cell, the map has a solution and is then displayed to the player.

[1] https://en.wikipedia.org/wiki/Von_Neumann_neighborhood

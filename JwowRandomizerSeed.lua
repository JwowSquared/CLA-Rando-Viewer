local base = 0x02C24592
local domain = "System Bus"
local output_path = "jwow_randomizer_seed.txt"

local previous_tid = -1
local previous_sid = -1

local i = 0
local j = 0
local frames_to_wait = 60

while true do
    gui.clearGraphics()
    i = i + 1
    if i >= frames_to_wait then
        i = 0

        local tid = memory.read_u16_le(base, domain)
        local sid = memory.read_u16_le(base + 2, domain)
        --local tid = memory.read_u32_le(base, domain)

        if tid ~= previous_tid or sid ~= previous_sid then
        --if tid ~= previous_tid then
            previous_tid = tid
            previous_sid = sid

            --local full_id = (sid * 0x10000) + tid
            local file = io.open(output_path, "w")
            file:write(string.format("%i\n", tid))
            file:write(string.format("%i\n", sid))
            file:close()

            j = frames_to_wait
        end
    end

    if j > 0 then
        gui.drawRectangle(5, 5, 140, 20, "white", "black")
        gui.drawText(10, 8, string.format("Jwow Feedback %i", j), "white", "black")
        j = j - 1
    end

    emu.frameadvance()
end
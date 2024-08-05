package e106.emissary_backend.domain.openvidu.controller;

import com.google.gson.JsonObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/api/vidu")
public class OpenViduController {
    @PostMapping("/join")
    public ResponseEntity<JsonObject> join(@RequestBody Map<String, Object> params) {
        // join session
        JsonObject response = new JsonObject();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<JsonObject> create(@RequestBody Map<String, Object> params) {
        JsonObject response = new JsonObject();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/leave")
    public ResponseEntity<JsonObject> leave(@RequestBody Map<String, Object> params) {
        JsonObject response = new JsonObject();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/kick")
    public ResponseEntity<JsonObject> kick(@RequestBody Map<String, Object> params) {
        JsonObject response = new JsonObject();
        return ResponseEntity.ok(response);
    }
}

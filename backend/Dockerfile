FROM openjdk:17-alpine
VOLUME /tmp
ARG JAR_FILE=build/libs/emissary_backend-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
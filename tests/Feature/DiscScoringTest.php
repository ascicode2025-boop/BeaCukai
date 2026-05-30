<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;

class DiscScoringTest extends TestCase
{
    use WithoutMiddleware;

    private function scoringKey(): array
    {
        return [
            '1A' => ['M' => 'I', 'L' => 'I'], '1B' => ['M' => 'S', 'L' => '*'], '1C' => ['M' => 'D', 'L' => 'D'], '1D' => ['M' => 'C', 'L' => 'C'],
            '2A' => ['M' => 'C', 'L' => 'C'], '2B' => ['M' => '*', 'L' => 'I'], '2C' => ['M' => 'I', 'L' => 'I'], '2D' => ['M' => 'S', 'L' => 'S'],
            '3A' => ['M' => 'I', 'L' => 'C'], '3B' => ['M' => 'C', 'L' => '*'], '3C' => ['M' => 'S', 'L' => 'S'], '3D' => ['M' => 'D', 'L' => 'D'],
            '4A' => ['M' => 'C', 'L' => 'C'], '4B' => ['M' => 'S', 'L' => '*'], '4C' => ['M' => 'I', 'L' => 'I'], '4D' => ['M' => 'D', 'L' => 'D'],
            '5A' => ['M' => 'I', 'L' => 'I'], '5B' => ['M' => 'D', 'L' => 'D'], '5C' => ['M' => 'S', 'L' => 'S'], '5D' => ['M' => 'C', 'L' => 'C'],
            '6A' => ['M' => 'C', 'L' => 'C'], '6B' => ['M' => 'D', 'L' => 'D'], '6C' => ['M' => 'I', 'L' => 'I'], '6D' => ['M' => 'S', 'L' => 'S'],
            '7A' => ['M' => 'S', 'L' => 'S'], '7B' => ['M' => 'I', 'L' => 'C'], '7C' => ['M' => 'C', 'L' => '*'], '7D' => ['M' => 'D', 'L' => 'D'],
            '8A' => ['M' => 'I', 'L' => 'I'], '8B' => ['M' => 'S', 'L' => 'S'], '8C' => ['M' => 'C', 'L' => 'C'], '8D' => ['M' => 'D', 'L' => 'D'],
            '9A' => ['M' => 'D', 'L' => 'D'], '9B' => ['M' => 'C', 'L' => 'C'], '9C' => ['M' => 'I', 'L' => 'I'], '9D' => ['M' => 'S', 'L' => '*'],
            '10A' => ['M' => 'D', 'L' => 'D'], '10B' => ['M' => 'I', 'L' => 'C'], '10C' => ['M' => 'S', 'L' => 'S'], '10D' => ['M' => 'C', 'L' => '*'],
            '11A' => ['M' => 'I', 'L' => 'I'], '11B' => ['M' => 'D', 'L' => 'D'], '11C' => ['M' => 'S', 'L' => '*'], '11D' => ['M' => 'C', 'L' => 'C'],
            '12A' => ['M' => 'S', 'L' => 'S'], '12B' => ['M' => 'C', 'L' => 'C'], '12C' => ['M' => 'I', 'L' => 'I'], '12D' => ['M' => 'D', 'L' => 'D'],
            '13A' => ['M' => 'D', 'L' => 'D'], '13B' => ['M' => 'S', 'L' => 'S'], '13C' => ['M' => 'I', 'L' => 'I'], '13D' => ['M' => 'C', 'L' => 'C'],
            '14A' => ['M' => 'C', 'L' => 'C'], '14B' => ['M' => 'I', 'L' => 'I'], '14C' => ['M' => 'S', 'L' => 'S'], '14D' => ['M' => 'D', 'L' => 'D'],
            '15A' => ['M' => 'I', 'L' => 'I'], '15B' => ['M' => 'C', 'L' => 'C'], '15C' => ['M' => 'D', 'L' => 'D'], '15D' => ['M' => 'S', 'L' => 'S'],
            '16A' => ['M' => 'D', 'L' => 'D'], '16B' => ['M' => 'C', 'L' => 'C'], '16C' => ['M' => 'I', 'L' => 'I'], '16D' => ['M' => 'S', 'L' => 'S'],
            '17A' => ['M' => 'C', 'L' => 'C'], '17B' => ['M' => 'D', 'L' => 'D'], '17C' => ['M' => 'S', 'L' => 'S'], '17D' => ['M' => 'I', 'L' => 'I'],
            '18A' => ['M' => 'D', 'L' => 'D'], '18B' => ['M' => 'I', 'L' => 'I'], '18C' => ['M' => 'S', 'L' => 'S'], '18D' => ['M' => 'C', 'L' => 'C'],
            '19A' => ['M' => 'D', 'L' => 'D'], '19B' => ['M' => 'S', 'L' => '*'], '19C' => ['M' => 'I', 'L' => 'I'], '19D' => ['M' => 'C', 'L' => 'C'],
            '20A' => ['M' => 'D', 'L' => 'D'], '20B' => ['M' => 'S', 'L' => 'S'], '20C' => ['M' => 'I', 'L' => 'I'], '20D' => ['M' => 'C', 'L' => 'C'],
            '21A' => ['M' => 'S', 'L' => 'S'], '21B' => ['M' => 'D', 'L' => 'D'], '21C' => ['M' => 'I', 'L' => 'I'], '21D' => ['M' => 'C', 'L' => 'C'],
            '22A' => ['M' => 'S', 'L' => 'S'], '22B' => ['M' => 'I', 'L' => 'I'], '22C' => ['M' => 'D', 'L' => 'D'], '22D' => ['M' => 'C', 'L' => 'C'],
            '23A' => ['M' => 'D', 'L' => 'D'], '23B' => ['M' => 'I', 'L' => 'I'], '23C' => ['M' => 'S', 'L' => 'S'], '23D' => ['M' => 'C', 'L' => 'C'],
            '24A' => ['M' => 'S', 'L' => 'S'], '24B' => ['M' => 'I', 'L' => 'I'], '24C' => ['M' => 'D', 'L' => 'D'], '24D' => ['M' => 'C', 'L' => 'C'],
        ];
    }

    private function buildAnswersForTarget(string $target): array
    {
        $map = $this->scoringKey();
        $answers = [];

        for ($q = 1; $q <= 24; $q++) {
            $options = ["{$q}A", "{$q}B", "{$q}C", "{$q}D"];

            $mChoice = null;
            foreach ($options as $opt) {
                if (($map[$opt]['M'] ?? null) === $target) {
                    $mChoice = $opt;
                    break;
                }
            }
            $mChoice = $mChoice ?? $options[0];

            $lCandidates = array_filter($options, function ($opt) use ($map, $target, $mChoice) {
                return $opt !== $mChoice && ($map[$opt]['L'] ?? null) !== $target;
            });

            if (empty($lCandidates)) {
                $lCandidates = array_filter($options, fn($opt) => $opt !== $mChoice);
            }

            usort($lCandidates, function ($a, $b) use ($map) {
                $rank = fn($v) => ($map[$v]['L'] ?? '') === '*' ? 0 : 1;
                return $rank($a) <=> $rank($b);
            });

            $answers[(string) $q] = [
                'M' => array_values([$mChoice])[0],
                'L' => array_values($lCandidates)[0],
            ];
        }

        return $answers;
    }

    public function test_disc_profile_can_be_dominance_when_answers_are_d_dominant(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/submit-disc', [
            'answers' => $this->buildAnswersForTarget('D'),
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.sorted_traits.0', 'D')
            ->assertJsonPath('data.report.primaryType', 'D - Dominance');
    }

    public function test_disc_profile_can_be_influence_when_answers_are_i_dominant(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/submit-disc', [
            'answers' => $this->buildAnswersForTarget('I'),
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.sorted_traits.0', 'I')
            ->assertJsonPath('data.report.primaryType', 'I - Influence');
    }

    public function test_disc_profile_can_be_steadiness_when_answers_are_s_dominant(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/submit-disc', [
            'answers' => $this->buildAnswersForTarget('S'),
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.sorted_traits.0', 'S')
            ->assertJsonPath('data.report.primaryType', 'S - Steadiness');
    }

    public function test_disc_profile_can_be_compliance_when_answers_are_c_dominant(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/submit-disc', [
            'answers' => $this->buildAnswersForTarget('C'),
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.sorted_traits.0', 'C')
            ->assertJsonPath('data.report.primaryType', 'C - Compliance');
    }

    public function test_jpm_is_returned_and_matches_graph3_primary_normalization(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/submit-disc', [
            'answers' => $this->buildAnswersForTarget('D'),
        ]);

        $response->assertStatus(200)->assertJsonPath('status', 'success');

        $payload = $response->json('data');
        $primaryTrait = $payload['jpm']['primary_trait'];
        $primaryGraph3 = $payload['graph_scores']['Graph_3'][$primaryTrait];

        $expected = (int) round((($primaryGraph3 + 8) / 16) * 100);
        $expected = max(0, min(100, $expected));

        $this->assertSame($expected, $payload['jpm']['percentage']);
        $this->assertGreaterThanOrEqual(0, $payload['jpm']['percentage']);
        $this->assertLessThanOrEqual(100, $payload['jpm']['percentage']);
    }
}
